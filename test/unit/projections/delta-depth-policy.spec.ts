import { DeltaDepthPolicy } from '../../../src/projections/delta-depth-policy';

describe('delta-depth-policy', () => {
  it('handles domain payload', () => {
    const policy = new DeltaDepthPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-99',
      deltaId: 'a',
      closureId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
