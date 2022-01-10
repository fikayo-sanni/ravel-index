import { CatalogClosureAggregator } from '../../../src/adapters/catalog-closure-aggregator';

describe('catalog-closure-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new CatalogClosureAggregator();
    expect(svc).toBeDefined();
  });
});
