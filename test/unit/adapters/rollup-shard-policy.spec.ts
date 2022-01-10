import { RollupShardPolicy } from '../../../src/adapters/rollup-shard-policy';

describe('rollup-shard-policy', () => {
  it('handles domain payload', () => {
    const policy = new RollupShardPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-113',
      rollupId: 'a',
      versionId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
