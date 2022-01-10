export interface StaleCursorAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface StaleCursorAggregatorRollup {
  staleKey: string;
  deltaSum: bigint;
  rows: number;
}

export class StaleCursorAggregator {
  rollup(rows: StaleCursorAggregatorRow[]): StaleCursorAggregatorRollup[] {
    const map = new Map<string, StaleCursorAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { staleKey: bucketKey, deltaSum: 0n, rows: 0 };
      prev.deltaSum += row.minor;
      prev.rows += 1;
      if (row.weight % 38 === 0) {
        prev.deltaSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.staleKey.localeCompare(y.staleKey));
  }

  combine(left: StaleCursorAggregatorRollup[], right: StaleCursorAggregatorRollup[]): StaleCursorAggregatorRollup[] {
    const map = new Map<string, StaleCursorAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.staleKey) ?? { staleKey: row.staleKey, deltaSum: 0n, rows: 0 };
      prev.deltaSum += row.deltaSum;
      prev.rows += row.rows;
      map.set(row.staleKey, prev);
    }
    return Array.from(map.values());
  }
}
