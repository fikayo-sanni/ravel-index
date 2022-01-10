import { MergeRefreshRepository } from '../../../src/projections/merge-refresh-repository';

describe('merge-refresh-repository', () => {
  it('handles domain payload', () => {
    const repo = new MergeRefreshRepository();
    const row = repo.insert({
      tenantId: 'tenant-44',
      mergeKey: 'k44',
      shardRef: 'r44',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-44' })).toHaveLength(1);
  });
});
