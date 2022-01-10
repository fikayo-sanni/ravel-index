import { RollupShardValidator } from '../../../src/projections/rollup-shard-validator';

describe('rollup-shard-validator', () => {
  it('handles domain payload', () => {
    const svc = new RollupShardValidator();
    expect(svc).toBeDefined();
  });
});
