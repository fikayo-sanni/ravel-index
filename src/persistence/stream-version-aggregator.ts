export interface StreamVersionAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface StreamVersionAggregatorRollup {
  streamKey: string;
  cursorSum: bigint;
  rows: number;
}

export class StreamVersionAggregator {
  rollup(rows: StreamVersionAggregatorRow[]): StreamVersionAggregatorRollup[] {
    const map = new Map<string, StreamVersionAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { streamKey: bucketKey, cursorSum: 0n, rows: 0 };
      prev.cursorSum += row.minor;
      prev.rows += 1;
      if (row.weight % 9 === 0) {
        prev.cursorSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.streamKey.localeCompare(y.streamKey));
  }

  combine(left: StreamVersionAggregatorRollup[], right: StreamVersionAggregatorRollup[]): StreamVersionAggregatorRollup[] {
    const map = new Map<string, StreamVersionAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.streamKey) ?? { streamKey: row.streamKey, cursorSum: 0n, rows: 0 };
      prev.cursorSum += row.cursorSum;
      prev.rows += row.rows;
      map.set(row.streamKey, prev);
    }
    return Array.from(map.values());
  }
}
