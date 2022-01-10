import { InvalidateDependencyFlow } from '../../../src/workflows/invalidate-dependency-flow';

describe('invalidate-dependency-flow', () => {
  it('runs batch flow', () => {
    const flow = new InvalidateDependencyFlow();
    const res = flow.run({
      tenantId: 'tenant-37',
      batchId: 'batch-37',
      items: [
        { key: 'a', value: 'alpha37' },
        { key: 'b', value: 'beta37' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
