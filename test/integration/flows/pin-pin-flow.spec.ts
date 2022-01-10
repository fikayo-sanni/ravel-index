import { PinPinFlow } from '../../../src/workflows/pin-pin-flow';

describe('pin-pin-flow', () => {
  it('runs batch flow', () => {
    const flow = new PinPinFlow();
    const res = flow.run({
      tenantId: 'tenant-32',
      batchId: 'batch-32',
      items: [
        { key: 'a', value: 'alpha32' },
        { key: 'b', value: 'beta32' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
