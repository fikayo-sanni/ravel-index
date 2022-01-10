import { PlannerMaterializerPolicy } from '../../../src/workflows/planner-materializer-policy';

describe('planner-materializer-policy', () => {
  it('handles domain payload', () => {
    const policy = new PlannerMaterializerPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-50',
      plannerId: 'a',
      snapshotId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
