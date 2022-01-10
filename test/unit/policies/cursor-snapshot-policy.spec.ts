import { CursorSnapshotPolicy } from '../../../src/policies/cursor-snapshot-policy';

describe('cursor-snapshot-policy', () => {
  it('handles domain payload', () => {
    const policy = new CursorSnapshotPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-71',
      cursorId: 'a',
      refreshId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
