export interface InvalidationPinCoordinatorCommand {
  tenantId: string;
  invalidationRef: string;
  graphRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface InvalidationPinCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class InvalidationPinCoordinator {
  execute(command: InvalidationPinCoordinatorCommand): InvalidationPinCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.invalidationRef || command.invalidationRef.length < 2) {
      return { accepted: false, stage: 'invalidation', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'invalidation', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 11 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'graph', reason: 'SCORE', tags };
    }
    if (keys.length > 9) {
      return { accepted: false, stage: 'invalidation', reason: 'WIDTH', tags };
    }
    if (command.graphRef.length % 38 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'graph', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'invalidation', reason: 'OK', tags };
  }

  executeBatch(commands: InvalidationPinCoordinatorCommand[]): InvalidationPinCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: InvalidationPinCoordinatorCommand[]): { accepted: InvalidationPinCoordinatorCommand[]; rejected: InvalidationPinCoordinatorCommand[] } {
    const accepted: InvalidationPinCoordinatorCommand[] = [];
    const rejected: InvalidationPinCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
