export interface DepthBatchAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface DepthBatchAggregatorRollup {
  depthKey: string;
  rollupSum: bigint;
  rows: number;
}

export class DepthBatchAggregator {
  rollup(rows: DepthBatchAggregatorRow[]): DepthBatchAggregatorRollup[] {
    const map = new Map<string, DepthBatchAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { depthKey: bucketKey, rollupSum: 0n, rows: 0 };
      prev.rollupSum += row.minor;
      prev.rows += 1;
      if (row.weight % 36 === 0) {
        prev.rollupSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.depthKey.localeCompare(y.depthKey));
  }

  combine(left: DepthBatchAggregatorRollup[], right: DepthBatchAggregatorRollup[]): DepthBatchAggregatorRollup[] {
    const map = new Map<string, DepthBatchAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.depthKey) ?? { depthKey: row.depthKey, rollupSum: 0n, rows: 0 };
      prev.rollupSum += row.rollupSum;
      prev.rows += row.rows;
      map.set(row.depthKey, prev);
    }
    return Array.from(map.values());
  }
}
