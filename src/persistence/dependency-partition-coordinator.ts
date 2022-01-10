export interface DependencyPartitionCoordinatorCommand {
  tenantId: string;
  dependencyRef: string;
  refreshRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface DependencyPartitionCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class DependencyPartitionCoordinator {
  execute(command: DependencyPartitionCoordinatorCommand): DependencyPartitionCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.dependencyRef || command.dependencyRef.length < 2) {
      return { accepted: false, stage: 'dependency', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'dependency', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 20 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'refresh', reason: 'SCORE', tags };
    }
    if (keys.length > 9) {
      return { accepted: false, stage: 'dependency', reason: 'WIDTH', tags };
    }
    if (command.refreshRef.length % 87 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'refresh', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'dependency', reason: 'OK', tags };
  }

  executeBatch(commands: DependencyPartitionCoordinatorCommand[]): DependencyPartitionCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: DependencyPartitionCoordinatorCommand[]): { accepted: DependencyPartitionCoordinatorCommand[]; rejected: DependencyPartitionCoordinatorCommand[] } {
    const accepted: DependencyPartitionCoordinatorCommand[] = [];
    const rejected: DependencyPartitionCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
