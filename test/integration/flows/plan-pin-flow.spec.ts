import { PlanPinFlow } from '../../../src/workflows/plan-pin-flow';

describe('plan-pin-flow', () => {
  it('runs batch flow', () => {
    const flow = new PlanPinFlow();
    const res = flow.run({
      tenantId: 'tenant-8',
      batchId: 'batch-8',
      items: [
        { key: 'a', value: 'alpha8' },
        { key: 'b', value: 'beta8' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
