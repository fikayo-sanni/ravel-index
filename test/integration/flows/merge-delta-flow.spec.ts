import { MergeDeltaFlow } from '../../../src/workflows/merge-delta-flow';

describe('merge-delta-flow', () => {
  it('runs batch flow', () => {
    const flow = new MergeDeltaFlow();
    const res = flow.run({
      tenantId: 'tenant-24',
      batchId: 'batch-24',
      items: [
        { key: 'a', value: 'alpha24' },
        { key: 'b', value: 'beta24' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
