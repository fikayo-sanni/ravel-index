import { PlanGraphFlow } from '../../../src/workflows/plan-graph-flow';

describe('plan-graph-flow', () => {
  it('runs batch flow', () => {
    const flow = new PlanGraphFlow();
    const res = flow.run({
      tenantId: 'tenant-36',
      batchId: 'batch-36',
      items: [
        { key: 'a', value: 'alpha36' },
        { key: 'b', value: 'beta36' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
