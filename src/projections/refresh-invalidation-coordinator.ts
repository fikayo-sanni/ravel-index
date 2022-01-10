export interface RefreshInvalidationCoordinatorCommand {
  tenantId: string;
  refreshRef: string;
  indexRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface RefreshInvalidationCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class RefreshInvalidationCoordinator {
  execute(command: RefreshInvalidationCoordinatorCommand): RefreshInvalidationCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.refreshRef || command.refreshRef.length < 2) {
      return { accepted: false, stage: 'refresh', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'refresh', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 13 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'index', reason: 'SCORE', tags };
    }
    if (keys.length > 7) {
      return { accepted: false, stage: 'refresh', reason: 'WIDTH', tags };
    }
    if (command.indexRef.length % 29 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'index', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'refresh', reason: 'OK', tags };
  }

  executeBatch(commands: RefreshInvalidationCoordinatorCommand[]): RefreshInvalidationCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: RefreshInvalidationCoordinatorCommand[]): { accepted: RefreshInvalidationCoordinatorCommand[]; rejected: RefreshInvalidationCoordinatorCommand[] } {
    const accepted: RefreshInvalidationCoordinatorCommand[] = [];
    const rejected: RefreshInvalidationCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
