import { PartitionPlannerRepository } from '../../../src/adapters/partition-planner-repository';

describe('partition-planner-repository', () => {
  it('handles domain payload', () => {
    const repo = new PartitionPlannerRepository();
    const row = repo.insert({
      tenantId: 'tenant-93',
      partitionKey: 'k93',
      cursorRef: 'r93',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-93' })).toHaveLength(1);
  });
});
