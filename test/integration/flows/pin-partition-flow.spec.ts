import { PinPartitionFlow } from '../../../src/workflows/pin-partition-flow';

describe('pin-partition-flow', () => {
  it('runs batch flow', () => {
    const flow = new PinPartitionFlow();
    const res = flow.run({
      tenantId: 'tenant-18',
      batchId: 'batch-18',
      items: [
        { key: 'a', value: 'alpha18' },
        { key: 'b', value: 'beta18' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
