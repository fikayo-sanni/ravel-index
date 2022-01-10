import { PartitionPlannerValidator } from '../../../src/persistence/partition-planner-validator';

describe('partition-planner-validator', () => {
  it('handles domain payload', () => {
    const svc = new PartitionPlannerValidator();
    expect(svc).toBeDefined();
  });
});
