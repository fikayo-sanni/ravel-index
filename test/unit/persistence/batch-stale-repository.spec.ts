import { BatchStaleRepository } from '../../../src/persistence/batch-stale-repository';

describe('batch-stale-repository', () => {
  it('handles domain payload', () => {
    const repo = new BatchStaleRepository();
    const row = repo.insert({
      tenantId: 'tenant-37',
      batchKey: 'k37',
      graphRef: 'r37',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-37' })).toHaveLength(1);
  });
});
