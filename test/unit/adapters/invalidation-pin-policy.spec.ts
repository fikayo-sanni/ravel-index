import { InvalidationPinPolicy } from '../../../src/adapters/invalidation-pin-policy';

describe('invalidation-pin-policy', () => {
  it('handles domain payload', () => {
    const policy = new InvalidationPinPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-78',
      invalidationId: 'a',
      depthId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
