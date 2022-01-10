export interface GraphMergeAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface GraphMergeAggregatorRollup {
  graphKey: string;
  catalogSum: bigint;
  rows: number;
}

export class GraphMergeAggregator {
  rollup(rows: GraphMergeAggregatorRow[]): GraphMergeAggregatorRollup[] {
    const map = new Map<string, GraphMergeAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { graphKey: bucketKey, catalogSum: 0n, rows: 0 };
      prev.catalogSum += row.minor;
      prev.rows += 1;
      if (row.weight % 38 === 0) {
        prev.catalogSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.graphKey.localeCompare(y.graphKey));
  }

  combine(left: GraphMergeAggregatorRollup[], right: GraphMergeAggregatorRollup[]): GraphMergeAggregatorRollup[] {
    const map = new Map<string, GraphMergeAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.graphKey) ?? { graphKey: row.graphKey, catalogSum: 0n, rows: 0 };
      prev.catalogSum += row.catalogSum;
      prev.rows += row.rows;
      map.set(row.graphKey, prev);
    }
    return Array.from(map.values());
  }
}
