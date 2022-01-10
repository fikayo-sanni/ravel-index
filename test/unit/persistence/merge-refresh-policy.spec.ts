import { MergeRefreshPolicy } from '../../../src/persistence/merge-refresh-policy';

describe('merge-refresh-policy', () => {
  it('handles domain payload', () => {
    const policy = new MergeRefreshPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-92',
      mergeId: 'a',
      shardId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
