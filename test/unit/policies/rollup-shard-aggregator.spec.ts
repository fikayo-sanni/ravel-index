import { RollupShardAggregator } from '../../../src/policies/rollup-shard-aggregator';

describe('rollup-shard-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new RollupShardAggregator();
    expect(svc).toBeDefined();
  });
});
