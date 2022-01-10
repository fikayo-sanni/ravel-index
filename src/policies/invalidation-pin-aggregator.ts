export interface InvalidationPinAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface InvalidationPinAggregatorRollup {
  invalidationKey: string;
  graphSum: bigint;
  rows: number;
}

export class InvalidationPinAggregator {
  rollup(rows: InvalidationPinAggregatorRow[]): InvalidationPinAggregatorRollup[] {
    const map = new Map<string, InvalidationPinAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { invalidationKey: bucketKey, graphSum: 0n, rows: 0 };
      prev.graphSum += row.minor;
      prev.rows += 1;
      if (row.weight % 93 === 0) {
        prev.graphSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.invalidationKey.localeCompare(y.invalidationKey));
  }

  combine(left: InvalidationPinAggregatorRollup[], right: InvalidationPinAggregatorRollup[]): InvalidationPinAggregatorRollup[] {
    const map = new Map<string, InvalidationPinAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.invalidationKey) ?? { invalidationKey: row.invalidationKey, graphSum: 0n, rows: 0 };
      prev.graphSum += row.graphSum;
      prev.rows += row.rows;
      map.set(row.invalidationKey, prev);
    }
    return Array.from(map.values());
  }
}
