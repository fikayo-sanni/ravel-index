import { InvalidatePlannerFlow } from '../../../src/workflows/invalidate-planner-flow';

describe('invalidate-planner-flow', () => {
  it('runs batch flow', () => {
    const flow = new InvalidatePlannerFlow();
    const res = flow.run({
      tenantId: 'tenant-23',
      batchId: 'batch-23',
      items: [
        { key: 'a', value: 'alpha23' },
        { key: 'b', value: 'beta23' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
