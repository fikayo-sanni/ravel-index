import { DepthBatchAggregator } from '../../../src/projections/depth-batch-aggregator';

describe('depth-batch-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new DepthBatchAggregator();
    expect(svc).toBeDefined();
  });
});
