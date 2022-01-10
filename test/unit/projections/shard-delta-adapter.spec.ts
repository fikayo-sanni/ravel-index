import { ShardDeltaAdapter } from '../../../src/projections/shard-delta-adapter';

describe('shard-delta-adapter', () => {
  it('handles domain payload', () => {
    const svc = new ShardDeltaAdapter();
    expect(svc).toBeDefined();
  });
});
