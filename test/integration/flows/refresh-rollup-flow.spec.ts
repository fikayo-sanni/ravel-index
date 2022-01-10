import { RefreshRollupFlow } from '../../../src/workflows/refresh-rollup-flow';

describe('refresh-rollup-flow', () => {
  it('runs batch flow', () => {
    const flow = new RefreshRollupFlow();
    const res = flow.run({
      tenantId: 'tenant-14',
      batchId: 'batch-14',
      items: [
        { key: 'a', value: 'alpha14' },
        { key: 'b', value: 'beta14' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
