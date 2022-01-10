import { RegisterRollupPolicy } from '../../../src/policies/register-rollup-policy';

describe('register-rollup-policy', () => {
  it('handles domain payload', () => {
    const policy = new RegisterRollupPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-36',
      registerId: 'a',
      streamId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
