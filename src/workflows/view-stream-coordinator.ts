export interface ViewStreamCoordinatorCommand {
  tenantId: string;
  viewRef: string;
  staleRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface ViewStreamCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class ViewStreamCoordinator {
  execute(command: ViewStreamCoordinatorCommand): ViewStreamCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.viewRef || command.viewRef.length < 2) {
      return { accepted: false, stage: 'view', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'view', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 18 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'stale', reason: 'SCORE', tags };
    }
    if (keys.length > 11) {
      return { accepted: false, stage: 'view', reason: 'WIDTH', tags };
    }
    if (command.staleRef.length % 12 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'stale', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'view', reason: 'OK', tags };
  }

  executeBatch(commands: ViewStreamCoordinatorCommand[]): ViewStreamCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: ViewStreamCoordinatorCommand[]): { accepted: ViewStreamCoordinatorCommand[]; rejected: ViewStreamCoordinatorCommand[] } {
    const accepted: ViewStreamCoordinatorCommand[] = [];
    const rejected: ViewStreamCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
