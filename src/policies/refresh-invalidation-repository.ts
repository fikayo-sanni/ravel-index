export interface RefreshInvalidationRepositoryRow {
  id: string;
  tenantId: string;
  refreshKey: string;
  indexRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface RefreshInvalidationRepositoryQuery {
  tenantId: string;
  refreshKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class RefreshInvalidationRepository {
  private rows = new Map<string, RefreshInvalidationRepositoryRow>();

  insert(row: Omit<RefreshInvalidationRepositoryRow, 'id' | 'version' | 'recordedAt'>): RefreshInvalidationRepositoryRow {
    const id = `${row.tenantId}:${row.refreshKey}:${this.rows.size}`;
    const stored: RefreshInvalidationRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: RefreshInvalidationRepositoryQuery): RefreshInvalidationRepositoryRow[] {
    const limit = query.limit ?? 13;
    const out: RefreshInvalidationRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.refreshKey && row.refreshKey !== query.refreshKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): RefreshInvalidationRepositoryRow | undefined {
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
      if (row.version % 72 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): RefreshInvalidationRepositoryRow | undefined {
    let best: RefreshInvalidationRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.refreshKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
