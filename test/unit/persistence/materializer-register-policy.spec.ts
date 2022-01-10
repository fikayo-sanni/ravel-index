import { MaterializerRegisterPolicy } from '../../../src/persistence/materializer-register-policy';

describe('materializer-register-policy', () => {
  it('handles domain payload', () => {
    const policy = new MaterializerRegisterPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-127',
      materializerId: 'a',
      viewId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
