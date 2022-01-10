import { CatalogClosureRepository } from '../../../src/persistence/catalog-closure-repository';

describe('catalog-closure-repository', () => {
  it('handles domain payload', () => {
    const repo = new CatalogClosureRepository();
    const row = repo.insert({
      tenantId: 'tenant-72',
      catalogKey: 'k72',
      plannerRef: 'r72',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-72' })).toHaveLength(1);
  });
});
