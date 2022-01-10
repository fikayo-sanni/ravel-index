import { PlanRefreshFlow } from '../../../src/workflows/plan-refresh-flow';

describe('plan-refresh-flow', () => {
  it('runs batch flow', () => {
    const flow = new PlanRefreshFlow();
    const res = flow.run({
      tenantId: 'tenant-22',
      batchId: 'batch-22',
      items: [
        { key: 'a', value: 'alpha22' },
        { key: 'b', value: 'beta22' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
