import { RefreshInvalidationRepository } from '../../../src/policies/refresh-invalidation-repository';

describe('refresh-invalidation-repository', () => {
  it('handles domain payload', () => {
    const repo = new RefreshInvalidationRepository();
    const row = repo.insert({
      tenantId: 'tenant-121',
      refreshKey: 'k121',
      deltaRef: 'r121',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-121' })).toHaveLength(1);
  });
});
