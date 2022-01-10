import { RefreshDeltaFlow } from '../../../src/workflows/refresh-delta-flow';

describe('refresh-delta-flow', () => {
  it('runs batch flow', () => {
    const flow = new RefreshDeltaFlow();
    const res = flow.run({
      tenantId: 'tenant-0',
      batchId: 'batch-0',
      items: [
        { key: 'a', value: 'alpha0' },
        { key: 'b', value: 'beta0' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
