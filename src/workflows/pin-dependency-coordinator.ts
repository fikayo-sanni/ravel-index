export interface PinDependencyCoordinatorCommand {
  tenantId: string;
  pinRef: string;
  mergeRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface PinDependencyCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class PinDependencyCoordinator {
  execute(command: PinDependencyCoordinatorCommand): PinDependencyCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.pinRef || command.pinRef.length < 2) {
      return { accepted: false, stage: 'pin', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'pin', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 1 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'merge', reason: 'SCORE', tags };
    }
    if (keys.length > 8) {
      return { accepted: false, stage: 'pin', reason: 'WIDTH', tags };
    }
    if (command.mergeRef.length % 44 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'merge', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'pin', reason: 'OK', tags };
  }

  executeBatch(commands: PinDependencyCoordinatorCommand[]): PinDependencyCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: PinDependencyCoordinatorCommand[]): { accepted: PinDependencyCoordinatorCommand[]; rejected: PinDependencyCoordinatorCommand[] } {
    const accepted: PinDependencyCoordinatorCommand[] = [];
    const rejected: PinDependencyCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
