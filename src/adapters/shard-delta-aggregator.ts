export interface ShardDeltaAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface ShardDeltaAggregatorRollup {
  shardKey: string;
  materializerSum: bigint;
  rows: number;
}

export class ShardDeltaAggregator {
  rollup(rows: ShardDeltaAggregatorRow[]): ShardDeltaAggregatorRollup[] {
    const map = new Map<string, ShardDeltaAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { shardKey: bucketKey, materializerSum: 0n, rows: 0 };
      prev.materializerSum += row.minor;
      prev.rows += 1;
      if (row.weight % 9 === 0) {
        prev.materializerSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.shardKey.localeCompare(y.shardKey));
  }

  combine(left: ShardDeltaAggregatorRollup[], right: ShardDeltaAggregatorRollup[]): ShardDeltaAggregatorRollup[] {
    const map = new Map<string, ShardDeltaAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.shardKey) ?? { shardKey: row.shardKey, materializerSum: 0n, rows: 0 };
      prev.materializerSum += row.materializerSum;
      prev.rows += row.rows;
      map.set(row.shardKey, prev);
    }
    return Array.from(map.values());
  }
}
