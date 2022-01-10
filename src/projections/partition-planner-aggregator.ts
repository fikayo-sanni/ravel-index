export interface PartitionPlannerAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface PartitionPlannerAggregatorRollup {
  partitionKey: string;
  invalidationSum: bigint;
  rows: number;
}

export class PartitionPlannerAggregator {
  rollup(rows: PartitionPlannerAggregatorRow[]): PartitionPlannerAggregatorRollup[] {
    const map = new Map<string, PartitionPlannerAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { partitionKey: bucketKey, invalidationSum: 0n, rows: 0 };
      prev.invalidationSum += row.minor;
      prev.rows += 1;
      if (row.weight % 74 === 0) {
        prev.invalidationSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.partitionKey.localeCompare(y.partitionKey));
  }

  combine(left: PartitionPlannerAggregatorRollup[], right: PartitionPlannerAggregatorRollup[]): PartitionPlannerAggregatorRollup[] {
    const map = new Map<string, PartitionPlannerAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.partitionKey) ?? { partitionKey: row.partitionKey, invalidationSum: 0n, rows: 0 };
      prev.invalidationSum += row.invalidationSum;
      prev.rows += row.rows;
      map.set(row.partitionKey, prev);
    }
    return Array.from(map.values());
  }
}
