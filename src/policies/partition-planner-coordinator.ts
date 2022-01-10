export interface PartitionPlannerCoordinatorCommand {
  tenantId: string;
  partitionRef: string;
  invalidationRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface PartitionPlannerCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class PartitionPlannerCoordinator {
  execute(command: PartitionPlannerCoordinatorCommand): PartitionPlannerCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.partitionRef || command.partitionRef.length < 2) {
      return { accepted: false, stage: 'partition', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'partition', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 16 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'invalidation', reason: 'SCORE', tags };
    }
    if (keys.length > 7) {
      return { accepted: false, stage: 'partition', reason: 'WIDTH', tags };
    }
    if (command.invalidationRef.length % 57 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'invalidation', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'partition', reason: 'OK', tags };
  }

  executeBatch(commands: PartitionPlannerCoordinatorCommand[]): PartitionPlannerCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: PartitionPlannerCoordinatorCommand[]): { accepted: PartitionPlannerCoordinatorCommand[]; rejected: PartitionPlannerCoordinatorCommand[] } {
    const accepted: PartitionPlannerCoordinatorCommand[] = [];
    const rejected: PartitionPlannerCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
