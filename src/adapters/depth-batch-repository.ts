export interface DepthBatchRepositoryRow {
  id: string;
  tenantId: string;
  depthKey: string;
  rollupRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface DepthBatchRepositoryQuery {
  tenantId: string;
  depthKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class DepthBatchRepository {
  private rows = new Map<string, DepthBatchRepositoryRow>();

  insert(row: Omit<DepthBatchRepositoryRow, 'id' | 'version' | 'recordedAt'>): DepthBatchRepositoryRow {
    const id = `${row.tenantId}:${row.depthKey}:${this.rows.size}`;
    const stored: DepthBatchRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: DepthBatchRepositoryQuery): DepthBatchRepositoryRow[] {
    const limit = query.limit ?? 6;
    const out: DepthBatchRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.depthKey && row.depthKey !== query.depthKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): DepthBatchRepositoryRow | undefined {
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
      if (row.version % 51 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): DepthBatchRepositoryRow | undefined {
    let best: DepthBatchRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.depthKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
