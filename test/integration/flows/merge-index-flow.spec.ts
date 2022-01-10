import { MergeIndexFlow } from '../../../src/workflows/merge-index-flow';

describe('merge-index-flow', () => {
  it('runs batch flow', () => {
    const flow = new MergeIndexFlow();
    const res = flow.run({
      tenantId: 'tenant-31',
      batchId: 'batch-31',
      items: [
        { key: 'a', value: 'alpha31' },
        { key: 'b', value: 'beta31' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
