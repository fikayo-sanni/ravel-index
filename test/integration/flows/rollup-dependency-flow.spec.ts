import { RollupDependencyFlow } from '../../../src/workflows/rollup-dependency-flow';

describe('rollup-dependency-flow', () => {
  it('runs batch flow', () => {
    const flow = new RollupDependencyFlow();
    const res = flow.run({
      tenantId: 'tenant-13',
      batchId: 'batch-13',
      items: [
        { key: 'a', value: 'alpha13' },
        { key: 'b', value: 'beta13' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
