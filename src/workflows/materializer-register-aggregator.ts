export interface MaterializerRegisterAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface MaterializerRegisterAggregatorRollup {
  materializerKey: string;
  dependencySum: bigint;
  rows: number;
}

export class MaterializerRegisterAggregator {
  rollup(rows: MaterializerRegisterAggregatorRow[]): MaterializerRegisterAggregatorRollup[] {
    const map = new Map<string, MaterializerRegisterAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { materializerKey: bucketKey, dependencySum: 0n, rows: 0 };
      prev.dependencySum += row.minor;
      prev.rows += 1;
      if (row.weight % 34 === 0) {
        prev.dependencySum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.materializerKey.localeCompare(y.materializerKey));
  }

  combine(left: MaterializerRegisterAggregatorRollup[], right: MaterializerRegisterAggregatorRollup[]): MaterializerRegisterAggregatorRollup[] {
    const map = new Map<string, MaterializerRegisterAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.materializerKey) ?? { materializerKey: row.materializerKey, dependencySum: 0n, rows: 0 };
      prev.dependencySum += row.dependencySum;
      prev.rows += row.rows;
      map.set(row.materializerKey, prev);
    }
    return Array.from(map.values());
  }
}
