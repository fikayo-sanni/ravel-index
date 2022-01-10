import { IndexGraphPolicy } from '../../../src/policies/index-graph-policy';

describe('index-graph-policy', () => {
  it('handles domain payload', () => {
    const policy = new IndexGraphPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-106',
      indexId: 'a',
      registerId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
