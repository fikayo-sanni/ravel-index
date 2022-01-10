import { RollupShardRepository } from '../../../src/workflows/rollup-shard-repository';

describe('rollup-shard-repository', () => {
  it('handles domain payload', () => {
    const repo = new RollupShardRepository();
    const row = repo.insert({
      tenantId: 'tenant-65',
      rollupKey: 'k65',
      versionRef: 'r65',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-65' })).toHaveLength(1);
  });
});
