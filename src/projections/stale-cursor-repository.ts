export interface StaleCursorRepositoryRow {
  id: string;
  tenantId: string;
  staleKey: string;
  deltaRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface StaleCursorRepositoryQuery {
  tenantId: string;
  staleKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class StaleCursorRepository {
  private rows = new Map<string, StaleCursorRepositoryRow>();

  insert(row: Omit<StaleCursorRepositoryRow, 'id' | 'version' | 'recordedAt'>): StaleCursorRepositoryRow {
    const id = `${row.tenantId}:${row.staleKey}:${this.rows.size}`;
    const stored: StaleCursorRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: StaleCursorRepositoryQuery): StaleCursorRepositoryRow[] {
    const limit = query.limit ?? 7;
    const out: StaleCursorRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.staleKey && row.staleKey !== query.staleKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): StaleCursorRepositoryRow | undefined {
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
      if (row.version % 75 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): StaleCursorRepositoryRow | undefined {
    let best: StaleCursorRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.staleKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
