import { RefreshCatalogFlow } from '../../../src/workflows/refresh-catalog-flow';

describe('refresh-catalog-flow', () => {
  it('runs batch flow', () => {
    const flow = new RefreshCatalogFlow();
    const res = flow.run({
      tenantId: 'tenant-21',
      batchId: 'batch-21',
      items: [
        { key: 'a', value: 'alpha21' },
        { key: 'b', value: 'beta21' },
      ],
    });
    expect(res.accepted.length + res.rejected.length).toBe(2);
  });
});
