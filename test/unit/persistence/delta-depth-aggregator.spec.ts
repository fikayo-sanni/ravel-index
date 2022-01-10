import { DeltaDepthAggregator } from '../../../src/persistence/delta-depth-aggregator';

describe('delta-depth-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new DeltaDepthAggregator();
    expect(svc).toBeDefined();
  });
});
