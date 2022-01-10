import { VersionCatalogPolicy } from '../../../src/adapters/version-catalog-policy';

describe('version-catalog-policy', () => {
  it('handles domain payload', () => {
    const policy = new VersionCatalogPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-43',
      versionId: 'a',
      partitionId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
