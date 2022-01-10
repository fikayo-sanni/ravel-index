import { PinStreamFlow } from '../../../src/workflows/pin-stream-flow';

describe('pin-stream-flow', () => {
  it('runs batch flow', () => {
    const flow = new PinStreamFlow();
    const res = flow.run({
      tenantId: 'tenant-11',
      batchId: 'batch-11',
      items: [
        { key: 'a', value: 'alpha11' },
        { key: 'b', value: 'beta11' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
