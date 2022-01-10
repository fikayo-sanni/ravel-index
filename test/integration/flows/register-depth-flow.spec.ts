import { RegisterDepthFlow } from '../../../src/workflows/register-depth-flow';

describe('register-depth-flow', () => {
  it('runs batch flow', () => {
    const flow = new RegisterDepthFlow();
    const res = flow.run({
      tenantId: 'tenant-5',
      batchId: 'batch-5',
      items: [
        { key: 'a', value: 'alpha5' },
        { key: 'b', value: 'beta5' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
