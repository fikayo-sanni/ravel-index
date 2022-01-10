import { StaleCursorRepository } from '../../../src/projections/stale-cursor-repository';

describe('stale-cursor-repository', () => {
  it('handles domain payload', () => {
    const repo = new StaleCursorRepository();
    const row = repo.insert({
      tenantId: 'tenant-114',
      staleKey: 'k114',
      mergeRef: 'r114',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-114' })).toHaveLength(1);
  });
});
