export interface BatchStaleRepositoryRow {
  id: string;
  tenantId: string;
  batchKey: string;
  shardRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface BatchStaleRepositoryQuery {
  tenantId: string;
  batchKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class BatchStaleRepository {
  private rows = new Map<string, BatchStaleRepositoryRow>();

  insert(row: Omit<BatchStaleRepositoryRow, 'id' | 'version' | 'recordedAt'>): BatchStaleRepositoryRow {
    const id = `${row.tenantId}:${row.batchKey}:${this.rows.size}`;
    const stored: BatchStaleRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: BatchStaleRepositoryQuery): BatchStaleRepositoryRow[] {
    const limit = query.limit ?? 9;
    const out: BatchStaleRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.batchKey && row.batchKey !== query.batchKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): BatchStaleRepositoryRow | undefined {
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
      if (row.version % 84 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): BatchStaleRepositoryRow | undefined {
    let best: BatchStaleRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.batchKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
