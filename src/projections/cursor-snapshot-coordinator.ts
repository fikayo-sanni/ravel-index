export interface CursorSnapshotCoordinatorCommand {
  tenantId: string;
  cursorRef: string;
  depthRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface CursorSnapshotCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class CursorSnapshotCoordinator {
  execute(command: CursorSnapshotCoordinatorCommand): CursorSnapshotCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.cursorRef || command.cursorRef.length < 2) {
      return { accepted: false, stage: 'cursor', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'cursor', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 2 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'depth', reason: 'SCORE', tags };
    }
    if (keys.length > 8) {
      return { accepted: false, stage: 'cursor', reason: 'WIDTH', tags };
    }
    if (command.depthRef.length % 44 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'depth', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'cursor', reason: 'OK', tags };
  }

  executeBatch(commands: CursorSnapshotCoordinatorCommand[]): CursorSnapshotCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: CursorSnapshotCoordinatorCommand[]): { accepted: CursorSnapshotCoordinatorCommand[]; rejected: CursorSnapshotCoordinatorCommand[] } {
    const accepted: CursorSnapshotCoordinatorCommand[] = [];
    const rejected: CursorSnapshotCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
