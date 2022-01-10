import { InvalidateVersionFlow } from '../../../src/workflows/invalidate-version-flow';

describe('invalidate-version-flow', () => {
  it('runs batch flow', () => {
    const flow = new InvalidateVersionFlow();
    const res = flow.run({
      tenantId: 'tenant-16',
      batchId: 'batch-16',
      items: [
        { key: 'a', value: 'alpha16' },
        { key: 'b', value: 'beta16' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
