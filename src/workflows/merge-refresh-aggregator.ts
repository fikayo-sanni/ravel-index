export interface MergeRefreshAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface MergeRefreshAggregatorRollup {
  mergeKey: string;
  closureSum: bigint;
  rows: number;
}

export class MergeRefreshAggregator {
  rollup(rows: MergeRefreshAggregatorRow[]): MergeRefreshAggregatorRollup[] {
    const map = new Map<string, MergeRefreshAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { mergeKey: bucketKey, closureSum: 0n, rows: 0 };
      prev.closureSum += row.minor;
      prev.rows += 1;
      if (row.weight % 56 === 0) {
        prev.closureSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.mergeKey.localeCompare(y.mergeKey));
  }

  combine(left: MergeRefreshAggregatorRollup[], right: MergeRefreshAggregatorRollup[]): MergeRefreshAggregatorRollup[] {
    const map = new Map<string, MergeRefreshAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.mergeKey) ?? { mergeKey: row.mergeKey, closureSum: 0n, rows: 0 };
      prev.closureSum += row.closureSum;
      prev.rows += row.rows;
      map.set(row.mergeKey, prev);
    }
    return Array.from(map.values());
  }
}
