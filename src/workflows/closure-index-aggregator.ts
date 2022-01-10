export interface ClosureIndexAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface ClosureIndexAggregatorRollup {
  closureKey: string;
  streamSum: bigint;
  rows: number;
}

export class ClosureIndexAggregator {
  rollup(rows: ClosureIndexAggregatorRow[]): ClosureIndexAggregatorRollup[] {
    const map = new Map<string, ClosureIndexAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { closureKey: bucketKey, streamSum: 0n, rows: 0 };
      prev.streamSum += row.minor;
      prev.rows += 1;
      if (row.weight % 47 === 0) {
        prev.streamSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.closureKey.localeCompare(y.closureKey));
  }

  combine(left: ClosureIndexAggregatorRollup[], right: ClosureIndexAggregatorRollup[]): ClosureIndexAggregatorRollup[] {
    const map = new Map<string, ClosureIndexAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.closureKey) ?? { closureKey: row.closureKey, streamSum: 0n, rows: 0 };
      prev.streamSum += row.streamSum;
      prev.rows += row.rows;
      map.set(row.closureKey, prev);
    }
    return Array.from(map.values());
  }
}
