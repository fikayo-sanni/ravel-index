import { PlanSnapshotFlow } from '../../../src/workflows/plan-snapshot-flow';

describe('plan-snapshot-flow', () => {
  it('runs batch flow', () => {
    const flow = new PlanSnapshotFlow();
    const res = flow.run({
      tenantId: 'tenant-1',
      batchId: 'batch-1',
      items: [
        { key: 'a', value: 'alpha1' },
        { key: 'b', value: 'beta1' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
