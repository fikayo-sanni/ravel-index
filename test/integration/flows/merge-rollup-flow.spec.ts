import { MergeRollupFlow } from '../../../src/workflows/merge-rollup-flow';

describe('merge-rollup-flow', () => {
  it('runs batch flow', () => {
    const flow = new MergeRollupFlow();
    const res = flow.run({
      tenantId: 'tenant-38',
      batchId: 'batch-38',
      items: [
        { key: 'a', value: 'alpha38' },
        { key: 'b', value: 'beta38' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
