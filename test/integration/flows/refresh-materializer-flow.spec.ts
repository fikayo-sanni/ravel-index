import { RefreshMaterializerFlow } from '../../../src/workflows/refresh-materializer-flow';

describe('refresh-materializer-flow', () => {
  it('runs batch flow', () => {
    const flow = new RefreshMaterializerFlow();
    const res = flow.run({
      tenantId: 'tenant-28',
      batchId: 'batch-28',
      items: [
        { key: 'a', value: 'alpha28' },
        { key: 'b', value: 'beta28' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
