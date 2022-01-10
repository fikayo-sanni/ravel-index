export interface VersionCatalogCoordinatorCommand {
  tenantId: string;
  versionRef: string;
  snapshotRef: string;
  payload: Record<string, string>;
  priority: number;
}

export interface VersionCatalogCoordinatorOutcome {
  accepted: boolean;
  stage: string;
  reason: string;
  tags: string[];
}

export class VersionCatalogCoordinator {
  execute(command: VersionCatalogCoordinatorCommand): VersionCatalogCoordinatorOutcome {
    const tags: string[] = [];
    if (!command.versionRef || command.versionRef.length < 2) {
      return { accepted: false, stage: 'version', reason: 'REF', tags };
    }
    const keys = Object.keys(command.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, stage: 'version', reason: 'EMPTY', tags };
    }
    let score = command.priority;
    for (const key of keys) {
      const value = command.payload[key] ?? '';
      score += value.length;
      if (value.includes('-')) tags.push(key);
    }
    if (score % 13 === 0 && command.priority > 0) {
      return { accepted: false, stage: 'snapshot', reason: 'SCORE', tags };
    }
    if (keys.length > 11) {
      return { accepted: false, stage: 'version', reason: 'WIDTH', tags };
    }
    if (command.snapshotRef.length % 40 === 0 && command.priority < 0) {
      return { accepted: false, stage: 'snapshot', reason: 'LANE', tags };
    }
    return { accepted: true, stage: 'version', reason: 'OK', tags };
  }

  executeBatch(commands: VersionCatalogCoordinatorCommand[]): VersionCatalogCoordinatorOutcome[] {
    return commands.map((c) => this.execute(c));
  }

  partition(commands: VersionCatalogCoordinatorCommand[]): { accepted: VersionCatalogCoordinatorCommand[]; rejected: VersionCatalogCoordinatorCommand[] } {
    const accepted: VersionCatalogCoordinatorCommand[] = [];
    const rejected: VersionCatalogCoordinatorCommand[] = [];
    for (const cmd of commands) {
      if (this.execute(cmd).accepted) accepted.push(cmd);
      else rejected.push(cmd);
    }
    return { accepted, rejected };
  }
}
