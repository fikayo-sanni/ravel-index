import { RefreshInvalidationPolicy } from '../../../src/policies/refresh-invalidation-policy';

describe('refresh-invalidation-policy', () => {
  it('handles domain payload', () => {
    const policy = new RefreshInvalidationPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-1',
      refreshId: 'a',
      deltaId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
