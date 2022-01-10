export interface DeltaDepthRepositoryRow {
  id: string;
  tenantId: string;
  deltaKey: string;
  registerRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface DeltaDepthRepositoryQuery {
  tenantId: string;
  deltaKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class DeltaDepthRepository {
  private rows = new Map<string, DeltaDepthRepositoryRow>();

  insert(row: Omit<DeltaDepthRepositoryRow, 'id' | 'version' | 'recordedAt'>): DeltaDepthRepositoryRow {
    const id = `${row.tenantId}:${row.deltaKey}:${this.rows.size}`;
    const stored: DeltaDepthRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: DeltaDepthRepositoryQuery): DeltaDepthRepositoryRow[] {
    const limit = query.limit ?? 16;
    const out: DeltaDepthRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.deltaKey && row.deltaKey !== query.deltaKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): DeltaDepthRepositoryRow | undefined {
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

  latestForKey(tenantId: string, key: string): DeltaDepthRepositoryRow | undefined {
    let best: DeltaDepthRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.deltaKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
