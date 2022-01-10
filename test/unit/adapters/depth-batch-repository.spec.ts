import { DepthBatchRepository } from '../../../src/adapters/depth-batch-repository';

describe('depth-batch-repository', () => {
  it('handles domain payload', () => {
    const repo = new DepthBatchRepository();
    const row = repo.insert({
      tenantId: 'tenant-128',
      depthKey: 'k128',
      indexRef: 'r128',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-128' })).toHaveLength(1);
  });
});
