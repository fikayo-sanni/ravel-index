import { RefreshStreamFlow } from '../../../src/workflows/refresh-stream-flow';

describe('refresh-stream-flow', () => {
  it('runs batch flow', () => {
    const flow = new RefreshStreamFlow();
    const res = flow.run({
      tenantId: 'tenant-35',
      batchId: 'batch-35',
      items: [
        { key: 'a', value: 'alpha35' },
        { key: 'b', value: 'beta35' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
