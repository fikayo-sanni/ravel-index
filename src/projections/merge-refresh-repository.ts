export interface MergeRefreshRepositoryRow {
  id: string;
  tenantId: string;
  mergeKey: string;
  closureRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface MergeRefreshRepositoryQuery {
  tenantId: string;
  mergeKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class MergeRefreshRepository {
  private rows = new Map<string, MergeRefreshRepositoryRow>();

  insert(row: Omit<MergeRefreshRepositoryRow, 'id' | 'version' | 'recordedAt'>): MergeRefreshRepositoryRow {
    const id = `${row.tenantId}:${row.mergeKey}:${this.rows.size}`;
    const stored: MergeRefreshRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: MergeRefreshRepositoryQuery): MergeRefreshRepositoryRow[] {
    const limit = query.limit ?? 12;
    const out: MergeRefreshRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.mergeKey && row.mergeKey !== query.mergeKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): MergeRefreshRepositoryRow | undefined {
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
      if (row.version % 32 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): MergeRefreshRepositoryRow | undefined {
    let best: MergeRefreshRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.mergeKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
