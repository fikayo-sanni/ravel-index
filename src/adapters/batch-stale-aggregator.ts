export interface BatchStaleAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface BatchStaleAggregatorRollup {
  batchKey: string;
  shardSum: bigint;
  rows: number;
}

export class BatchStaleAggregator {
  rollup(rows: BatchStaleAggregatorRow[]): BatchStaleAggregatorRollup[] {
    const map = new Map<string, BatchStaleAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { batchKey: bucketKey, shardSum: 0n, rows: 0 };
      prev.shardSum += row.minor;
      prev.rows += 1;
      if (row.weight % 18 === 0) {
        prev.shardSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.batchKey.localeCompare(y.batchKey));
  }

  combine(left: BatchStaleAggregatorRollup[], right: BatchStaleAggregatorRollup[]): BatchStaleAggregatorRollup[] {
    const map = new Map<string, BatchStaleAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.batchKey) ?? { batchKey: row.batchKey, shardSum: 0n, rows: 0 };
      prev.shardSum += row.shardSum;
      prev.rows += row.rows;
      map.set(row.batchKey, prev);
    }
    return Array.from(map.values());
  }
}
