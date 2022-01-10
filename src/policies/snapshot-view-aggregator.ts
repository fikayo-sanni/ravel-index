export interface SnapshotViewAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface SnapshotViewAggregatorRollup {
  snapshotKey: string;
  batchSum: bigint;
  rows: number;
}

export class SnapshotViewAggregator {
  rollup(rows: SnapshotViewAggregatorRow[]): SnapshotViewAggregatorRollup[] {
    const map = new Map<string, SnapshotViewAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { snapshotKey: bucketKey, batchSum: 0n, rows: 0 };
      prev.batchSum += row.minor;
      prev.rows += 1;
      if (row.weight % 86 === 0) {
        prev.batchSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.snapshotKey.localeCompare(y.snapshotKey));
  }

  combine(left: SnapshotViewAggregatorRollup[], right: SnapshotViewAggregatorRollup[]): SnapshotViewAggregatorRollup[] {
    const map = new Map<string, SnapshotViewAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.snapshotKey) ?? { snapshotKey: row.snapshotKey, batchSum: 0n, rows: 0 };
      prev.batchSum += row.batchSum;
      prev.rows += row.rows;
      map.set(row.snapshotKey, prev);
    }
    return Array.from(map.values());
  }
}
