export interface DependencyPartitionRepositoryRow {
  id: string;
  tenantId: string;
  dependencyKey: string;
  refreshRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface DependencyPartitionRepositoryQuery {
  tenantId: string;
  dependencyKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class DependencyPartitionRepository {
  private rows = new Map<string, DependencyPartitionRepositoryRow>();

  insert(row: Omit<DependencyPartitionRepositoryRow, 'id' | 'version' | 'recordedAt'>): DependencyPartitionRepositoryRow {
    const id = `${row.tenantId}:${row.dependencyKey}:${this.rows.size}`;
    const stored: DependencyPartitionRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: DependencyPartitionRepositoryQuery): DependencyPartitionRepositoryRow[] {
    const limit = query.limit ?? 9;
    const out: DependencyPartitionRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.dependencyKey && row.dependencyKey !== query.dependencyKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): DependencyPartitionRepositoryRow | undefined {
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
      if (row.version % 45 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): DependencyPartitionRepositoryRow | undefined {
    let best: DependencyPartitionRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.dependencyKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
