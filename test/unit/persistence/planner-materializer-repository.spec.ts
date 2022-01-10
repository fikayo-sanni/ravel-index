import { PlannerMaterializerRepository } from '../../../src/persistence/planner-materializer-repository';

describe('planner-materializer-repository', () => {
  it('handles domain payload', () => {
    const repo = new PlannerMaterializerRepository();
    const row = repo.insert({
      tenantId: 'tenant-2',
      plannerKey: 'k2',
      snapshotRef: 'r2',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-2' })).toHaveLength(1);
  });
});
