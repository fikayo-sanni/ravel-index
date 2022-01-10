import { MergeMergeFlow } from '../../../src/workflows/merge-merge-flow';

describe('merge-merge-flow', () => {
  it('runs batch flow', () => {
    const flow = new MergeMergeFlow();
    const res = flow.run({
      tenantId: 'tenant-17',
      batchId: 'batch-17',
      items: [
        { key: 'a', value: 'alpha17' },
        { key: 'b', value: 'beta17' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
