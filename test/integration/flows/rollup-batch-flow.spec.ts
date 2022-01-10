import { RollupBatchFlow } from '../../../src/workflows/rollup-batch-flow';

describe('rollup-batch-flow', () => {
  it('runs batch flow', () => {
    const flow = new RollupBatchFlow();
    const res = flow.run({
      tenantId: 'tenant-34',
      batchId: 'batch-34',
      items: [
        { key: 'a', value: 'alpha34' },
        { key: 'b', value: 'beta34' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
