import { InvalidateViewFlow } from '../../../src/workflows/invalidate-view-flow';

describe('invalidate-view-flow', () => {
  it('runs batch flow', () => {
    const flow = new InvalidateViewFlow();
    const res = flow.run({
      tenantId: 'tenant-30',
      batchId: 'batch-30',
      items: [
        { key: 'a', value: 'alpha30' },
        { key: 'b', value: 'beta30' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
