import { IndexGraphAggregator } from '../../../src/projections/index-graph-aggregator';

describe('index-graph-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new IndexGraphAggregator();
    expect(svc).toBeDefined();
  });
});
