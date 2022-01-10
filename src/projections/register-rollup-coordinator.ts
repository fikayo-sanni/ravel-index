export interface RegisterRollupCoordinatorCommand {
  tenantId: string;
  registerRef: string;
  partitionRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface RegisterRollupCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class RegisterRollupCoordinator {
  execute(command: RegisterRollupCoordinatorCommand): RegisterRollupCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.registerRef || command.registerRef.length < 2) {
      return { accepted: false, stage: 'register', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'register', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 10 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'partition', reason: 'SCORE', tags };
    }
    if (keys.length > 7) {
      return { accepted: false, stage: 'register', reason: 'WIDTH', tags };
    }
    if (command.partitionRef.length % 71 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'partition', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'register', reason: 'OK', tags };
  }

  executeBatch(commands: RegisterRollupCoordinatorCommand[]): RegisterRollupCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: RegisterRollupCoordinatorCommand[]): { accepted: RegisterRollupCoordinatorCommand[]; rejected: RegisterRollupCoordinatorCommand[] } {
    const accepted: RegisterRollupCoordinatorCommand[] = [];
    const rejected: RegisterRollupCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
