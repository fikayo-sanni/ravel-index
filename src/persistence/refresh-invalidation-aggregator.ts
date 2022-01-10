export interface RefreshInvalidationAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface RefreshInvalidationAggregatorRollup {
  refreshKey: string;
  indexSum: bigint;
  rows: number;
}

export class RefreshInvalidationAggregator {
  rollup(rows: RefreshInvalidationAggregatorRow[]): RefreshInvalidationAggregatorRollup[] {
    const map = new Map<string, RefreshInvalidationAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { refreshKey: bucketKey, indexSum: 0n, rows: 0 };
      prev.indexSum += row.minor;
      prev.rows += 1;
      if (row.weight % 76 === 0) {
        prev.indexSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.refreshKey.localeCompare(y.refreshKey));
  }

  combine(left: RefreshInvalidationAggregatorRollup[], right: RefreshInvalidationAggregatorRollup[]): RefreshInvalidationAggregatorRollup[] {
    const map = new Map<string, RefreshInvalidationAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.refreshKey) ?? { refreshKey: row.refreshKey, indexSum: 0n, rows: 0 };
      prev.indexSum += row.indexSum;
      prev.rows += row.rows;
      map.set(row.refreshKey, prev);
    }
    return Array.from(map.values());
  }
}
