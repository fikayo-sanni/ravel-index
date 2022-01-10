import { InvalidateClosureFlow } from '../../../src/workflows/invalidate-closure-flow';

describe('invalidate-closure-flow', () => {
  it('runs batch flow', () => {
    const flow = new InvalidateClosureFlow();
    const res = flow.run({
      tenantId: 'tenant-2',
      batchId: 'batch-2',
      items: [
        { key: 'a', value: 'alpha2' },
        { key: 'b', value: 'beta2' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
