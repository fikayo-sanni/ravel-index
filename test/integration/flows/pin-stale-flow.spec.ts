import { PinStaleFlow } from '../../../src/workflows/pin-stale-flow';

describe('pin-stale-flow', () => {
  it('runs batch flow', () => {
    const flow = new PinStaleFlow();
    const res = flow.run({
      tenantId: 'tenant-39',
      batchId: 'batch-39',
      items: [
        { key: 'a', value: 'alpha39' },
        { key: 'b', value: 'beta39' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
