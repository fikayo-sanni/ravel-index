import { DependencyPartitionRepository } from '../../../src/policies/dependency-partition-repository';

describe('dependency-partition-repository', () => {
  it('handles domain payload', () => {
    const repo = new DependencyPartitionRepository();
    const row = repo.insert({
      tenantId: 'tenant-16',
      dependencyKey: 'k16',
      staleRef: 'r16',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-16' })).toHaveLength(1);
  });
});
