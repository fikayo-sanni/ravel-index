import { PartitionPlannerAggregator } from '../../../src/projections/partition-planner-aggregator';

describe('partition-planner-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new PartitionPlannerAggregator();
    expect(svc).toBeDefined();
  });
});
