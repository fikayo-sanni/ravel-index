export interface ClosureIndexCoordinatorCommand {
  tenantId: string;
  closureRef: string;
  streamRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface ClosureIndexCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class ClosureIndexCoordinator {
  execute(command: ClosureIndexCoordinatorCommand): ClosureIndexCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.closureRef || command.closureRef.length < 2) {
      return { accepted: false, stage: 'closure', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'closure', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 8 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'stream', reason: 'SCORE', tags };
    }
    if (keys.length > 9) {
      return { accepted: false, stage: 'closure', reason: 'WIDTH', tags };
    }
    if (command.streamRef.length % 24 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'stream', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'closure', reason: 'OK', tags };
  }

  executeBatch(commands: ClosureIndexCoordinatorCommand[]): ClosureIndexCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: ClosureIndexCoordinatorCommand[]): { accepted: ClosureIndexCoordinatorCommand[]; rejected: ClosureIndexCoordinatorCommand[] } {
    const accepted: ClosureIndexCoordinatorCommand[] = [];
    const rejected: ClosureIndexCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
