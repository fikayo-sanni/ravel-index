import { DepthBatchPolicy } from '../../../src/adapters/depth-batch-policy';

describe('depth-batch-policy', () => {
  it('handles domain payload', () => {
    const policy = new DepthBatchPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-8',
      depthId: 'a',
      indexId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
