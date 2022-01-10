import { RollupShardAdapter } from '../../../src/persistence/rollup-shard-adapter';

describe('rollup-shard-adapter', () => {
  it('handles domain payload', () => {
    const svc = new RollupShardAdapter();
    expect(svc).toBeDefined();
  });
});
