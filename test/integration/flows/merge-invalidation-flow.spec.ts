import { MergeInvalidationFlow } from '../../../src/workflows/merge-invalidation-flow';

describe('merge-invalidation-flow', () => {
  it('runs batch flow', () => {
    const flow = new MergeInvalidationFlow();
    const res = flow.run({
      tenantId: 'tenant-3',
      batchId: 'batch-3',
      items: [
        { key: 'a', value: 'alpha3' },
        { key: 'b', value: 'beta3' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
