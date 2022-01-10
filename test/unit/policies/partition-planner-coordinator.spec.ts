import { PartitionPlannerCoordinator } from '../../../src/policies/partition-planner-coordinator';

describe('partition-planner-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new PartitionPlannerCoordinator();
    expect(svc).toBeDefined();
  });
});
