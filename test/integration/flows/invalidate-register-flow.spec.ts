import { InvalidateRegisterFlow } from '../../../src/workflows/invalidate-register-flow';

describe('invalidate-register-flow', () => {
  it('runs batch flow', () => {
    const flow = new InvalidateRegisterFlow();
    const res = flow.run({
      tenantId: 'tenant-9',
      batchId: 'batch-9',
      items: [
        { key: 'a', value: 'alpha9' },
        { key: 'b', value: 'beta9' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
