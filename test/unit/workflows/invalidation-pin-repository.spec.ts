import { InvalidationPinRepository } from '../../../src/workflows/invalidation-pin-repository';

describe('invalidation-pin-repository', () => {
  it('handles domain payload', () => {
    const repo = new InvalidationPinRepository();
    const row = repo.insert({
      tenantId: 'tenant-30',
      invalidationKey: 'k30',
      depthRef: 'r30',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-30' })).toHaveLength(1);
  });
});
