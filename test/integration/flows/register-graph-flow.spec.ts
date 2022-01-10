import { RegisterGraphFlow } from '../../../src/workflows/register-graph-flow';

describe('register-graph-flow', () => {
  it('runs batch flow', () => {
    const flow = new RegisterGraphFlow();
    const res = flow.run({
      tenantId: 'tenant-12',
      batchId: 'batch-12',
      items: [
        { key: 'a', value: 'alpha12' },
        { key: 'b', value: 'beta12' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
