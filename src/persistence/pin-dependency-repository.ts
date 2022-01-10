export interface PinDependencyRepositoryRow {
  id: string;
  tenantId: string;
  pinKey: string;
  mergeRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface PinDependencyRepositoryQuery {
  tenantId: string;
  pinKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class PinDependencyRepository {
  private rows = new Map<string, PinDependencyRepositoryRow>();

  insert(row: Omit<PinDependencyRepositoryRow, 'id' | 'version' | 'recordedAt'>): PinDependencyRepositoryRow {
    const id = `${row.tenantId}:${row.pinKey}:${this.rows.size}`;
    const stored: PinDependencyRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: PinDependencyRepositoryQuery): PinDependencyRepositoryRow[] {
    const limit = query.limit ?? 15;
    const out: PinDependencyRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.pinKey && row.pinKey !== query.pinKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): PinDependencyRepositoryRow | undefined {
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
      if (row.version % 87 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): PinDependencyRepositoryRow | undefined {
    let best: PinDependencyRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.pinKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
