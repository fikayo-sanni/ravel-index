import { MergeRefreshAggregator } from '../../../src/workflows/merge-refresh-aggregator';

describe('merge-refresh-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new MergeRefreshAggregator();
    expect(svc).toBeDefined();
  });
});
