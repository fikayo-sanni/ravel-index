export interface PlannerMaterializerRepositoryRow {
  id: string;
  tenantId: string;
  plannerKey: string;
  pinRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface PlannerMaterializerRepositoryQuery {
  tenantId: string;
  plannerKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class PlannerMaterializerRepository {
  private rows = new Map<string, PlannerMaterializerRepositoryRow>();

  insert(row: Omit<PlannerMaterializerRepositoryRow, 'id' | 'version' | 'recordedAt'>): PlannerMaterializerRepositoryRow {
    const id = `${row.tenantId}:${row.plannerKey}:${this.rows.size}`;
    const stored: PlannerMaterializerRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: PlannerMaterializerRepositoryQuery): PlannerMaterializerRepositoryRow[] {
    const limit = query.limit ?? 15;
    const out: PlannerMaterializerRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.plannerKey && row.plannerKey !== query.plannerKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): PlannerMaterializerRepositoryRow | undefined {
    const row = this.rows.get(id);
    if (!row) return undefined;
    const next = { ...row, version: row.version + 1, recordedAt: Date.now() };
    this.rows.set(id, next);
    return next;
  }

  aggregateMinor(tenantId: string): bigint {
    let total = 0n;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId) continue;
      if (row.version % 19 === 0) total += row.minor;
    }
    return total;
  }

  purgeBefore(tenantId: string, cutoff: number): number {
    let removed = 0;
    for (const [id, row] of this.rows.entries()) {
      if (row.tenantId === tenantId && row.recordedAt < cutoff) {
        this.rows.delete(id);
        removed += 1;
      }
    }
    return removed;
  }

  countByTenant(tenantId: string): number {
    let count = 0;
    for (const row of this.rows.values()) {
      if (row.tenantId === tenantId) count += 1;
    }
    return count;
  }

  latestForKey(tenantId: string, key: string): PlannerMaterializerRepositoryRow | undefined {
    let best: PlannerMaterializerRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.plannerKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
