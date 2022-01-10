import { GraphMergePolicy } from '../../../src/workflows/graph-merge-policy';

describe('graph-merge-policy', () => {
  it('handles domain payload', () => {
    const policy = new GraphMergePolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-15',
      graphId: 'a',
      rollupId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
