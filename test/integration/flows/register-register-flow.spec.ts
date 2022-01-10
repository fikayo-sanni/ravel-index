import { RegisterRegisterFlow } from '../../../src/workflows/register-register-flow';

describe('register-register-flow', () => {
  it('runs batch flow', () => {
    const flow = new RegisterRegisterFlow();
    const res = flow.run({
      tenantId: 'tenant-33',
      batchId: 'batch-33',
      items: [
        { key: 'a', value: 'alpha33' },
        { key: 'b', value: 'beta33' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
