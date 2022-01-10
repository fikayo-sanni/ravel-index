export interface SnapshotViewCoordinatorCommand {
  tenantId: string;
  snapshotRef: string;
  batchRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface SnapshotViewCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class SnapshotViewCoordinator {
  execute(command: SnapshotViewCoordinatorCommand): SnapshotViewCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.snapshotRef || command.snapshotRef.length < 2) {
      return { accepted: false, stage: 'snapshot', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'snapshot', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 12 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'batch', reason: 'SCORE', tags };
    }
    if (keys.length > 8) {
      return { accepted: false, stage: 'snapshot', reason: 'WIDTH', tags };
    }
    if (command.batchRef.length % 2 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'batch', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'snapshot', reason: 'OK', tags };
  }

  executeBatch(commands: SnapshotViewCoordinatorCommand[]): SnapshotViewCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: SnapshotViewCoordinatorCommand[]): { accepted: SnapshotViewCoordinatorCommand[]; rejected: SnapshotViewCoordinatorCommand[] } {
    const accepted: SnapshotViewCoordinatorCommand[] = [];
    const rejected: SnapshotViewCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
