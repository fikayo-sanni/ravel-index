import { RollupCursorFlow } from '../../../src/workflows/rollup-cursor-flow';

describe('rollup-cursor-flow', () => {
  it('runs batch flow', () => {
    const flow = new RollupCursorFlow();
    const res = flow.run({
      tenantId: 'tenant-20',
      batchId: 'batch-20',
      items: [
        { key: 'a', value: 'alpha20' },
        { key: 'b', value: 'beta20' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
