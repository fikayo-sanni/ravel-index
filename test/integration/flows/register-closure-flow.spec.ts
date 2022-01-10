import { RegisterClosureFlow } from '../../../src/workflows/register-closure-flow';

describe('register-closure-flow', () => {
  it('runs batch flow', () => {
    const flow = new RegisterClosureFlow();
    const res = flow.run({
      tenantId: 'tenant-26',
      batchId: 'batch-26',
      items: [
        { key: 'a', value: 'alpha26' },
        { key: 'b', value: 'beta26' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
