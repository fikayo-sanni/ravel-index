export interface CursorSnapshotRepositoryRow {
  id: string;
  tenantId: string;
  cursorKey: string;
  depthRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface CursorSnapshotRepositoryQuery {
  tenantId: string;
  cursorKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class CursorSnapshotRepository {
  private rows = new Map<string, CursorSnapshotRepositoryRow>();

  insert(row: Omit<CursorSnapshotRepositoryRow, 'id' | 'version' | 'recordedAt'>): CursorSnapshotRepositoryRow {
    const id = `${row.tenantId}:${row.cursorKey}:${this.rows.size}`;
    const stored: CursorSnapshotRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: CursorSnapshotRepositoryQuery): CursorSnapshotRepositoryRow[] {
    const limit = query.limit ?? 13;
    const out: CursorSnapshotRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.cursorKey && row.cursorKey !== query.cursorKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): CursorSnapshotRepositoryRow | undefined {
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
      if (row.version % 55 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): CursorSnapshotRepositoryRow | undefined {
    let best: CursorSnapshotRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.cursorKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
