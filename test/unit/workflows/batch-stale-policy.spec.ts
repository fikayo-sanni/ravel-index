import { BatchStalePolicy } from '../../../src/workflows/batch-stale-policy';

describe('batch-stale-policy', () => {
  it('handles domain payload', () => {
    const policy = new BatchStalePolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-85',
      batchId: 'a',
      graphId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
