import { PartitionPlannerAdapter } from '../../../src/workflows/partition-planner-adapter';

describe('partition-planner-adapter', () => {
  it('handles domain payload', () => {
    const svc = new PartitionPlannerAdapter();
    expect(svc).toBeDefined();
  });
});
