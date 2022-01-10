import { RollupInvalidationFlow } from '../../../src/workflows/rollup-invalidation-flow';

describe('rollup-invalidation-flow', () => {
  it('runs batch flow', () => {
    const flow = new RollupInvalidationFlow();
    const res = flow.run({
      tenantId: 'tenant-27',
      batchId: 'batch-27',
      items: [
        { key: 'a', value: 'alpha27' },
        { key: 'b', value: 'beta27' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
