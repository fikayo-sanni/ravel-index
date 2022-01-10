export interface PartitionPlannerRepositoryRow {
  id: string;
  tenantId: string;
  partitionKey: string;
  invalidationRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface PartitionPlannerRepositoryQuery {
  tenantId: string;
  partitionKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class PartitionPlannerRepository {
  private rows = new Map<string, PartitionPlannerRepositoryRow>();

  insert(row: Omit<PartitionPlannerRepositoryRow, 'id' | 'version' | 'recordedAt'>): PartitionPlannerRepositoryRow {
    const id = `${row.tenantId}:${row.partitionKey}:${this.rows.size}`;
    const stored: PartitionPlannerRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: PartitionPlannerRepositoryQuery): PartitionPlannerRepositoryRow[] {
    const limit = query.limit ?? 9;
    const out: PartitionPlannerRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.partitionKey && row.partitionKey !== query.partitionKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): PartitionPlannerRepositoryRow | undefined {
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
      if (row.version % 91 === 0) total += row.minor;
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

  latestForKey(tenantId: string, key: string): PartitionPlannerRepositoryRow | undefined {
    let best: PartitionPlannerRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.partitionKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
