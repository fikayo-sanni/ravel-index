import { PinDependencyRepository } from '../../../src/persistence/pin-dependency-repository';

describe('pin-dependency-repository', () => {
  it('handles domain payload', () => {
    const repo = new PinDependencyRepository();
    const row = repo.insert({
      tenantId: 'tenant-107',
      pinKey: 'k107',
      batchRef: 'r107',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-107' })).toHaveLength(1);
  });
});
