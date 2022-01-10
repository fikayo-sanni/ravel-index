export interface IndexGraphAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface IndexGraphAggregatorRollup {
  indexKey: string;
  versionSum: bigint;
  rows: number;
}

export class IndexGraphAggregator {
  rollup(rows: IndexGraphAggregatorRow[]): IndexGraphAggregatorRollup[] {
    const map = new Map<string, IndexGraphAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { indexKey: bucketKey, versionSum: 0n, rows: 0 };
      prev.versionSum += row.minor;
      prev.rows += 1;
      if (row.weight % 21 === 0) {
        prev.versionSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.indexKey.localeCompare(y.indexKey));
  }

  combine(left: IndexGraphAggregatorRollup[], right: IndexGraphAggregatorRollup[]): IndexGraphAggregatorRollup[] {
    const map = new Map<string, IndexGraphAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.indexKey) ?? { indexKey: row.indexKey, versionSum: 0n, rows: 0 };
      prev.versionSum += row.versionSum;
      prev.rows += row.rows;
      map.set(row.indexKey, prev);
    }
    return Array.from(map.values());
  }
}
