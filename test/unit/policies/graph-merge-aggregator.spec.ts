import { GraphMergeAggregator } from '../../../src/policies/graph-merge-aggregator';

describe('graph-merge-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new GraphMergeAggregator();
    expect(svc).toBeDefined();
  });
});
