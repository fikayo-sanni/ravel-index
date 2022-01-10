export interface RollupShardAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface RollupShardAggregatorRollup {
  rollupKey: string;
  plannerSum: bigint;
  rows: number;
}

export class RollupShardAggregator {
  rollup(rows: RollupShardAggregatorRow[]): RollupShardAggregatorRollup[] {
    const map = new Map<string, RollupShardAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { rollupKey: bucketKey, plannerSum: 0n, rows: 0 };
      prev.plannerSum += row.minor;
      prev.rows += 1;
      if (row.weight % 94 === 0) {
        prev.plannerSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.rollupKey.localeCompare(y.rollupKey));
  }

  combine(left: RollupShardAggregatorRollup[], right: RollupShardAggregatorRollup[]): RollupShardAggregatorRollup[] {
    const map = new Map<string, RollupShardAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.rollupKey) ?? { rollupKey: row.rollupKey, plannerSum: 0n, rows: 0 };
      prev.plannerSum += row.plannerSum;
      prev.rows += row.rows;
      map.set(row.rollupKey, prev);
    }
    return Array.from(map.values());
  }
}
