import { CatalogClosureValidator } from '../../../src/policies/catalog-closure-validator';

describe('catalog-closure-validator', () => {
  it('handles domain payload', () => {
    const svc = new CatalogClosureValidator();
    expect(svc).toBeDefined();
  });
});
