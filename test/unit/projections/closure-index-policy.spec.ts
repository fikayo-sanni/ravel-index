import { ClosureIndexPolicy } from '../../../src/projections/closure-index-policy';

describe('closure-index-policy', () => {
  it('handles domain payload', () => {
    const policy = new ClosureIndexPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-29',
      closureId: 'a',
      materializerId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
