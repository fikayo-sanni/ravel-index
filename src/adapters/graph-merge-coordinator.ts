export interface GraphMergeCoordinatorCommand {
  tenantId: string;
  graphRef: string;
  catalogRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface GraphMergeCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class GraphMergeCoordinator {
  execute(command: GraphMergeCoordinatorCommand): GraphMergeCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.graphRef || command.graphRef.length < 2) {
      return { accepted: false, stage: 'graph', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'graph', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 9 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'catalog', reason: 'SCORE', tags };
    }
    if (keys.length > 11) {
      return { accepted: false, stage: 'graph', reason: 'WIDTH', tags };
    }
    if (command.catalogRef.length % 75 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'catalog', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'graph', reason: 'OK', tags };
  }

  executeBatch(commands: GraphMergeCoordinatorCommand[]): GraphMergeCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: GraphMergeCoordinatorCommand[]): { accepted: GraphMergeCoordinatorCommand[]; rejected: GraphMergeCoordinatorCommand[] } {
    const accepted: GraphMergeCoordinatorCommand[] = [];
    const rejected: GraphMergeCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
