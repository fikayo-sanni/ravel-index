export interface MaterializerRegisterCoordinatorCommand {
  tenantId: string;
  materializerRef: string;
  dependencyRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface MaterializerRegisterCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class MaterializerRegisterCoordinator {
  execute(command: MaterializerRegisterCoordinatorCommand): MaterializerRegisterCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.materializerRef || command.materializerRef.length < 2) {
      return { accepted: false, stage: 'materializer', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'materializer', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 1 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'dependency', reason: 'SCORE', tags };
    }
    if (keys.length > 9) {
      return { accepted: false, stage: 'materializer', reason: 'WIDTH', tags };
    }
    if (command.dependencyRef.length % 17 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'dependency', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'materializer', reason: 'OK', tags };
  }

  executeBatch(commands: MaterializerRegisterCoordinatorCommand[]): MaterializerRegisterCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: MaterializerRegisterCoordinatorCommand[]): { accepted: MaterializerRegisterCoordinatorCommand[]; rejected: MaterializerRegisterCoordinatorCommand[] } {
    const accepted: MaterializerRegisterCoordinatorCommand[] = [];
    const rejected: MaterializerRegisterCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
