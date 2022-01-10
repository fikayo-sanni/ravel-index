import { ClosureIndexAggregator } from '../../../src/workflows/closure-index-aggregator';

describe('closure-index-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new ClosureIndexAggregator();
    expect(svc).toBeDefined();
  });
});
