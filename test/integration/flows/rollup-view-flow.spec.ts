import { RollupViewFlow } from '../../../src/workflows/rollup-view-flow';

describe('rollup-view-flow', () => {
  it('runs batch flow', () => {
    const flow = new RollupViewFlow();
    const res = flow.run({
      tenantId: 'tenant-6',
      batchId: 'batch-6',
      items: [
        { key: 'a', value: 'alpha6' },
        { key: 'b', value: 'beta6' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
