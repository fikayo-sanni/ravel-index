export interface PlannerMaterializerCoordinatorCommand {
  tenantId: string;
  plannerRef: string;
  pinRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface PlannerMaterializerCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class PlannerMaterializerCoordinator {
  execute(command: PlannerMaterializerCoordinatorCommand): PlannerMaterializerCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.plannerRef || command.plannerRef.length < 2) {
      return { accepted: false, stage: 'planner', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'planner', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 4 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'pin', reason: 'SCORE', tags };
    }
    if (keys.length > 7) {
      return { accepted: false, stage: 'planner', reason: 'WIDTH', tags };
    }
    if (command.pinRef.length % 8 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'pin', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'planner', reason: 'OK', tags };
  }

  executeBatch(commands: PlannerMaterializerCoordinatorCommand[]): PlannerMaterializerCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: PlannerMaterializerCoordinatorCommand[]): { accepted: PlannerMaterializerCoordinatorCommand[]; rejected: PlannerMaterializerCoordinatorCommand[] } {
    const accepted: PlannerMaterializerCoordinatorCommand[] = [];
    const rejected: PlannerMaterializerCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
