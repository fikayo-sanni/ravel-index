import { DeltaDepthRepository } from '../../../src/policies/delta-depth-repository';

describe('delta-depth-repository', () => {
  it('handles domain payload', () => {
    const repo = new DeltaDepthRepository();
    const row = repo.insert({
      tenantId: 'tenant-51',
      deltaKey: 'k51',
      closureRef: 'r51',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-51' })).toHaveLength(1);
  });
});
