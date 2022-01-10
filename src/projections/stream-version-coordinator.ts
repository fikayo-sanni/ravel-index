export interface StreamVersionCoordinatorCommand {
  tenantId: string;
  streamRef: string;
  cursorRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface StreamVersionCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class StreamVersionCoordinator {
  execute(command: StreamVersionCoordinatorCommand): StreamVersionCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.streamRef || command.streamRef.length < 2) {
      return { accepted: false, stage: 'stream', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'stream', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 20 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'cursor', reason: 'SCORE', tags };
    }
    if (keys.length > 11) {
      return { accepted: false, stage: 'stream', reason: 'WIDTH', tags };
    }
    if (command.cursorRef.length % 54 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'cursor', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'stream', reason: 'OK', tags };
  }

  executeBatch(commands: StreamVersionCoordinatorCommand[]): StreamVersionCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: StreamVersionCoordinatorCommand[]): { accepted: StreamVersionCoordinatorCommand[]; rejected: StreamVersionCoordinatorCommand[] } {
    const accepted: StreamVersionCoordinatorCommand[] = [];
    const rejected: StreamVersionCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
