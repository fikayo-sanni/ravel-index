import { ShardDeltaPolicy } from '../../../src/persistence/shard-delta-policy';

describe('shard-delta-policy', () => {
  it('handles domain payload', () => {
    const policy = new ShardDeltaPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-22',
      shardId: 'a',
      catalogId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
