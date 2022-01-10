import { PlanStaleFlow } from '../../../src/workflows/plan-stale-flow';

describe('plan-stale-flow', () => {
  it('runs batch flow', () => {
    const flow = new PlanStaleFlow();
    const res = flow.run({
      tenantId: 'tenant-15',
      batchId: 'batch-15',
      items: [
        { key: 'a', value: 'alpha15' },
        { key: 'b', value: 'beta15' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
