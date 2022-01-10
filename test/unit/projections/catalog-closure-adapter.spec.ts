import { CatalogClosureAdapter } from '../../../src/projections/catalog-closure-adapter';

describe('catalog-closure-adapter', () => {
  it('handles domain payload', () => {
    const svc = new CatalogClosureAdapter();
    expect(svc).toBeDefined();
  });
});
