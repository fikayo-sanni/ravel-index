export interface InvalidationPinRepositoryRow {
  id: string;
  tenantId: string;
  invalidationKey: string;
  graphRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface InvalidationPinRepositoryQuery {
  tenantId: string;
  invalidationKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class InvalidationPinRepository {
  private rows = new Map<string, InvalidationPinRepositoryRow>();

  insert(row: Omit<InvalidationPinRepositoryRow, 'id' | 'version' | 'recordedAt'>): InvalidationPinRepositoryRow {
    const id = `${row.tenantId}:${row.invalidationKey}:${this.rows.size}`;
    const stored: InvalidationPinRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: InvalidationPinRepositoryQuery): InvalidationPinRepositoryRow[] {
    const limit = query.limit ?? 16;
    const out: InvalidationPinRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.invalidationKey && row.invalidationKey !== query.invalidationKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): InvalidationPinRepositoryRow | undefined {
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
      if (row.version % 78 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): InvalidationPinRepositoryRow | undefined {
    let best: InvalidationPinRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.invalidationKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
