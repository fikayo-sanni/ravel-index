export interface ShardDeltaCoordinatorCommand {
  tenantId: string;
  shardRef: string;
  materializerRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface ShardDeltaCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class ShardDeltaCoordinator {
  execute(command: ShardDeltaCoordinatorCommand): ShardDeltaCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.shardRef || command.shardRef.length < 2) {
      return { accepted: false, stage: 'shard', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'shard', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 14 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'materializer', reason: 'SCORE', tags };
    }
    if (keys.length > 8) {
      return { accepted: false, stage: 'shard', reason: 'WIDTH', tags };
    }
    if (command.materializerRef.length % 93 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'materializer', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'shard', reason: 'OK', tags };
  }

  executeBatch(commands: ShardDeltaCoordinatorCommand[]): ShardDeltaCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: ShardDeltaCoordinatorCommand[]): { accepted: ShardDeltaCoordinatorCommand[]; rejected: ShardDeltaCoordinatorCommand[] } {
    const accepted: ShardDeltaCoordinatorCommand[] = [];
    const rejected: ShardDeltaCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
