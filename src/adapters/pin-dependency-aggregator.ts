export interface PinDependencyAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface PinDependencyAggregatorRollup {
  pinKey: string;
  mergeSum: bigint;
  rows: number;
}

export class PinDependencyAggregator {
  rollup(rows: PinDependencyAggregatorRow[]): PinDependencyAggregatorRollup[] {
    const map = new Map<string, PinDependencyAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { pinKey: bucketKey, mergeSum: 0n, rows: 0 };
      prev.mergeSum += row.minor;
      prev.rows += 1;
      if (row.weight % 42 === 0) {
        prev.mergeSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.pinKey.localeCompare(y.pinKey));
  }

  combine(left: PinDependencyAggregatorRollup[], right: PinDependencyAggregatorRollup[]): PinDependencyAggregatorRollup[] {
    const map = new Map<string, PinDependencyAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.pinKey) ?? { pinKey: row.pinKey, mergeSum: 0n, rows: 0 };
      prev.mergeSum += row.mergeSum;
      prev.rows += row.rows;
      map.set(row.pinKey, prev);
    }
    return Array.from(map.values());
  }
}
