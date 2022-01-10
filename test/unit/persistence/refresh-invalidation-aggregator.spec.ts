import { RefreshInvalidationAggregator } from '../../../src/persistence/refresh-invalidation-aggregator';

describe('refresh-invalidation-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new RefreshInvalidationAggregator();
    expect(svc).toBeDefined();
  });
});
