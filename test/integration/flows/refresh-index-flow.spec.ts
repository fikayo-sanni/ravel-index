import { RefreshIndexFlow } from '../../../src/workflows/refresh-index-flow';

describe('refresh-index-flow', () => {
  it('runs batch flow', () => {
    const flow = new RefreshIndexFlow();
    const res = flow.run({
      tenantId: 'tenant-7',
      batchId: 'batch-7',
      items: [
        { key: 'a', value: 'alpha7' },
        { key: 'b', value: 'beta7' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
