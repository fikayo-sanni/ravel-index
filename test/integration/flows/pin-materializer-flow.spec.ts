import { PinMaterializerFlow } from '../../../src/workflows/pin-materializer-flow';

describe('pin-materializer-flow', () => {
  it('runs batch flow', () => {
    const flow = new PinMaterializerFlow();
    const res = flow.run({
      tenantId: 'tenant-4',
      batchId: 'batch-4',
      items: [
        { key: 'a', value: 'alpha4' },
        { key: 'b', value: 'beta4' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
