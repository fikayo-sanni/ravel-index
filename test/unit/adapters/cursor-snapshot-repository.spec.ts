import { CursorSnapshotRepository } from '../../../src/adapters/cursor-snapshot-repository';

describe('cursor-snapshot-repository', () => {
  it('handles domain payload', () => {
    const repo = new CursorSnapshotRepository();
    const row = repo.insert({
      tenantId: 'tenant-23',
      cursorKey: 'k23',
      refreshRef: 'r23',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-23' })).toHaveLength(1);
  });
});
