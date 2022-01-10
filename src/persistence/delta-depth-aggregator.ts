export interface DeltaDepthAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface DeltaDepthAggregatorRollup {
  deltaKey: string;
  registerSum: bigint;
  rows: number;
}

export class DeltaDepthAggregator {
  rollup(rows: DeltaDepthAggregatorRow[]): DeltaDepthAggregatorRollup[] {
    const map = new Map<string, DeltaDepthAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { deltaKey: bucketKey, registerSum: 0n, rows: 0 };
      prev.registerSum += row.minor;
      prev.rows += 1;
      if (row.weight % 19 === 0) {
        prev.registerSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.deltaKey.localeCompare(y.deltaKey));
  }

  combine(left: DeltaDepthAggregatorRollup[], right: DeltaDepthAggregatorRollup[]): DeltaDepthAggregatorRollup[] {
    const map = new Map<string, DeltaDepthAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.deltaKey) ?? { deltaKey: row.deltaKey, registerSum: 0n, rows: 0 };
      prev.registerSum += row.registerSum;
      prev.rows += row.rows;
      map.set(row.deltaKey, prev);
    }
    return Array.from(map.values());
  }
}
