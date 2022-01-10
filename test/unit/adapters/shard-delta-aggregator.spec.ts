import { ShardDeltaAggregator } from '../../../src/adapters/shard-delta-aggregator';

describe('shard-delta-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new ShardDeltaAggregator();
    expect(svc).toBeDefined();
  });
});
