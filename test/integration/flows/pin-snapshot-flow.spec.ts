import { PinSnapshotFlow } from '../../../src/workflows/pin-snapshot-flow';

describe('pin-snapshot-flow', () => {
  it('runs batch flow', () => {
    const flow = new PinSnapshotFlow();
    const res = flow.run({
      tenantId: 'tenant-25',
      batchId: 'batch-25',
      items: [
        { key: 'a', value: 'alpha25' },
        { key: 'b', value: 'beta25' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
