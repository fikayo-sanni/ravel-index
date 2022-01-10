import { InvalidationPinAggregator } from '../../../src/policies/invalidation-pin-aggregator';

describe('invalidation-pin-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new InvalidationPinAggregator();
    expect(svc).toBeDefined();
  });
});
