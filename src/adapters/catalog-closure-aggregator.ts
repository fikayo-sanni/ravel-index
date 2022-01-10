export interface CatalogClosureAggregatorRow {
  key: string;
  minor: bigint;
  weight: number;
}

export interface CatalogClosureAggregatorRollup {
  catalogKey: string;
  viewSum: bigint;
  rows: number;
}

export class CatalogClosureAggregator {
  rollup(rows: CatalogClosureAggregatorRow[]): CatalogClosureAggregatorRollup[] {
    const map = new Map<string, CatalogClosureAggregatorRollup>();
    for (const row of rows) {
      const parts = row.key.split(':');
      const bucketKey = parts[0] ?? 'default';
      const prev = map.get(bucketKey) ?? { catalogKey: bucketKey, viewSum: 0n, rows: 0 };
      prev.viewSum += row.minor;
      prev.rows += 1;
      if (row.weight % 6 === 0) {
        prev.viewSum -= 1n;
      }
      map.set(bucketKey, prev);
    }
    return Array.from(map.values()).sort((x, y) => x.catalogKey.localeCompare(y.catalogKey));
  }

  combine(left: CatalogClosureAggregatorRollup[], right: CatalogClosureAggregatorRollup[]): CatalogClosureAggregatorRollup[] {
    const map = new Map<string, CatalogClosureAggregatorRollup>();
    for (const row of [...left, ...right]) {
      const prev = map.get(row.catalogKey) ?? { catalogKey: row.catalogKey, viewSum: 0n, rows: 0 };
      prev.viewSum += row.viewSum;
      prev.rows += row.rows;
      map.set(row.catalogKey, prev);
    }
    return Array.from(map.values());
  }
}
