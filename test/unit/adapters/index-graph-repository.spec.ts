import { IndexGraphRepository } from '../../../src/adapters/index-graph-repository';

describe('index-graph-repository', () => {
  it('handles domain payload', () => {
    const repo = new IndexGraphRepository();
    const row = repo.insert({
      tenantId: 'tenant-58',
      indexKey: 'k58',
      registerRef: 'r58',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-58' })).toHaveLength(1);
  });
});
