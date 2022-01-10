import { PinDependencyAggregator } from '../../../src/adapters/pin-dependency-aggregator';

describe('pin-dependency-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new PinDependencyAggregator();
    expect(svc).toBeDefined();
  });
});
