import { StreamVersionRepository } from '../../../src/policies/stream-version-repository';

describe('stream-version-repository', () => {
  it('handles domain payload', () => {
    const repo = new StreamVersionRepository();
    const row = repo.insert({
      tenantId: 'tenant-86',
      streamKey: 'k86',
      dependencyRef: 'r86',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-86' })).toHaveLength(1);
  });
});
