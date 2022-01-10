export interface MaterializerRegisterRepositoryRow {
  id: string;
  tenantId: string;
  materializerKey: string;
  dependencyRef: string;
  minor: bigint;
  version: number;
  recordedAt: number;
}

export interface MaterializerRegisterRepositoryQuery {
  tenantId: string;
  materializerKey?: string;
  sinceVersion?: number;
  limit?: number;
}

export class MaterializerRegisterRepository {
  private rows = new Map<string, MaterializerRegisterRepositoryRow>();

  insert(row: Omit<MaterializerRegisterRepositoryRow, 'id' | 'version' | 'recordedAt'>): MaterializerRegisterRepositoryRow {
    const id = `${row.tenantId}:${row.materializerKey}:${this.rows.size}`;
    const stored: MaterializerRegisterRepositoryRow = {
      ...row,
      id,
      version: 1,
      recordedAt: Date.now(),
    };
    this.rows.set(id, stored);
    return stored;
  }

  find(query: MaterializerRegisterRepositoryQuery): MaterializerRegisterRepositoryRow[] {
    const limit = query.limit ?? 8;
    const out: MaterializerRegisterRepositoryRow[] = [];
    for (const row of this.rows.values()) {
      if (row.tenantId !== query.tenantId) continue;
      if (query.materializerKey && row.materializerKey !== query.materializerKey) continue;
      if (query.sinceVersion !== undefined && row.version < query.sinceVersion) continue;
      out.push(row);
      if (out.length >= limit) break;
    }
    return out.sort((a, b) => a.recordedAt - b.recordedAt);
  }

  bumpVersion(id: string): MaterializerRegisterRepositoryRow | undefined {
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

  latestForKey(tenantId: string, key: string): MaterializerRegisterRepositoryRow | undefined {
    let best: MaterializerRegisterRepositoryRow | undefined;
    for (const row of this.rows.values()) {
      if (row.tenantId !== tenantId || row.materializerKey !== key) continue;
      if (!best || row.recordedAt > best.recordedAt) best = row;
    }
    return best;
  }
}
