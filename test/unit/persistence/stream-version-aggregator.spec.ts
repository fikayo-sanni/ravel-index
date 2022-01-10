import { StreamVersionAggregator } from '../../../src/persistence/stream-version-aggregator';

describe('stream-version-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new StreamVersionAggregator();
    expect(svc).toBeDefined();
  });
});
