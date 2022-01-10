import { CatalogClosurePolicy } from '../../../src/workflows/catalog-closure-policy';

describe('catalog-closure-policy', () => {
  it('handles domain payload', () => {
    const policy = new CatalogClosurePolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-120',
      catalogId: 'a',
      plannerId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
