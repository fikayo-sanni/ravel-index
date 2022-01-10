import { MergeBatchFlow } from '../../../src/workflows/merge-batch-flow';

describe('merge-batch-flow', () => {
  it('runs batch flow', () => {
    const flow = new MergeBatchFlow();
    const res = flow.run({
      tenantId: 'tenant-10',
      batchId: 'batch-10',
      items: [
        { key: 'a', value: 'alpha10' },
        { key: 'b', value: 'beta10' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
