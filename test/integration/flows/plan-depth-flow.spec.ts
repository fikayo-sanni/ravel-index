import { PlanDepthFlow } from '../../../src/workflows/plan-depth-flow';

describe('plan-depth-flow', () => {
  it('runs batch flow', () => {
    const flow = new PlanDepthFlow();
    const res = flow.run({
      tenantId: 'tenant-29',
      batchId: 'batch-29',
      items: [
        { key: 'a', value: 'alpha29' },
        { key: 'b', value: 'beta29' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
