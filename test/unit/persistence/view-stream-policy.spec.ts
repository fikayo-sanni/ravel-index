import { ViewStreamPolicy } from '../../../src/persistence/view-stream-policy';

describe('view-stream-policy', () => {
  it('handles domain payload', () => {
    const policy = new ViewStreamPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-57',
      viewId: 'a',
      pinId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
