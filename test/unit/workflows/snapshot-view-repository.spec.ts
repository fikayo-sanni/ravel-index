import { SnapshotViewRepository } from '../../../src/workflows/snapshot-view-repository';

describe('snapshot-view-repository', () => {
  it('handles domain payload', () => {
    const repo = new SnapshotViewRepository();
    const row = repo.insert({
      tenantId: 'tenant-100',
      snapshotKey: 'k100',
      invalidationRef: 'r100',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-100' })).toHaveLength(1);
  });
});
