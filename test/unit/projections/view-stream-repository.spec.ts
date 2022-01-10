import { ViewStreamRepository } from '../../../src/projections/view-stream-repository';

describe('view-stream-repository', () => {
  it('handles domain payload', () => {
    const repo = new ViewStreamRepository();
    const row = repo.insert({
      tenantId: 'tenant-9',
      viewKey: 'k9',
      pinRef: 'r9',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-9' })).toHaveLength(1);
  });
});
