export interface StaleCursorCoordinatorCommand {
  tenantId: string;
  staleRef: string;
  deltaRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface StaleCursorCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class StaleCursorCoordinator {
  execute(command: StaleCursorCoordinatorCommand): StaleCursorCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.staleRef || command.staleRef.length < 2) {
      return { accepted: false, stage: 'stale', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'stale', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 17 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'delta', reason: 'SCORE', tags };
    }
    if (keys.length > 11) {
      return { accepted: false, stage: 'stale', reason: 'WIDTH', tags };
    }
    if (command.deltaRef.length % 68 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'delta', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'stale', reason: 'OK', tags };
  }

  executeBatch(commands: StaleCursorCoordinatorCommand[]): StaleCursorCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: StaleCursorCoordinatorCommand[]): { accepted: StaleCursorCoordinatorCommand[]; rejected: StaleCursorCoordinatorCommand[] } {
    const accepted: StaleCursorCoordinatorCommand[] = [];
    const rejected: StaleCursorCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
