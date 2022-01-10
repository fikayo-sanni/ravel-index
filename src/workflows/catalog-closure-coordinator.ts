export interface CatalogClosureCoordinatorCommand {
  tenantId: string;
  catalogRef: string;
  viewRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface CatalogClosureCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class CatalogClosureCoordinator {
  execute(command: CatalogClosureCoordinatorCommand): CatalogClosureCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.catalogRef || command.catalogRef.length < 2) {
      return { accepted: false, stage: 'catalog', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'catalog', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 4 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'view', reason: 'SCORE', tags };
    }
    if (keys.length > 7) {
      return { accepted: false, stage: 'catalog', reason: 'WIDTH', tags };
    }
    if (command.viewRef.length % 43 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'view', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'catalog', reason: 'OK', tags };
  }

  executeBatch(commands: CatalogClosureCoordinatorCommand[]): CatalogClosureCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: CatalogClosureCoordinatorCommand[]): { accepted: CatalogClosureCoordinatorCommand[]; rejected: CatalogClosureCoordinatorCommand[] } {
    const accepted: CatalogClosureCoordinatorCommand[] = [];
    const rejected: CatalogClosureCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
