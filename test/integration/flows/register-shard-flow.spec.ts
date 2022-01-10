import { RegisterShardFlow } from '../../../src/workflows/register-shard-flow';

describe('register-shard-flow', () => {
  it('runs batch flow', () => {
    const flow = new RegisterShardFlow();
    const res = flow.run({
      tenantId: 'tenant-19',
      batchId: 'batch-19',
      items: [
        { key: 'a', value: 'alpha19' },
        { key: 'b', value: 'beta19' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
