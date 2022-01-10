export interface DepthBatchCoordinatorCommand {
  tenantId: string;
  depthRef: string;
  rollupRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface DepthBatchCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class DepthBatchCoordinator {
  execute(command: DepthBatchCoordinatorCommand): DepthBatchCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.depthRef || command.depthRef.length < 2) {
      return { accepted: false, stage: 'depth', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'depth', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 12 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'rollup', reason: 'SCORE', tags };
    }
    if (keys.length > 7) {
      return { accepted: false, stage: 'depth', reason: 'WIDTH', tags };
    }
    if (command.rollupRef.length % 1 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'rollup', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'depth', reason: 'OK', tags };
  }

  executeBatch(commands: DepthBatchCoordinatorCommand[]): DepthBatchCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: DepthBatchCoordinatorCommand[]): { accepted: DepthBatchCoordinatorCommand[]; rejected: DepthBatchCoordinatorCommand[] } {
    const accepted: DepthBatchCoordinatorCommand[] = [];
    const rejected: DepthBatchCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
