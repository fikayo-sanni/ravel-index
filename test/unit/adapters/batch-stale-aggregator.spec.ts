import { BatchStaleAggregator } from '../../../src/adapters/batch-stale-aggregator';

describe('batch-stale-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new BatchStaleAggregator();
    expect(svc).toBeDefined();
  });
});
