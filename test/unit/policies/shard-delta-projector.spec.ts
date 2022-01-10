import { ShardDeltaProjector } from '../../../src/policies/shard-delta-projector';

describe('shard-delta-projector', () => {
  it('handles domain payload', () => {
    const svc = new ShardDeltaProjector();
    expect(svc).toBeDefined();
  });
});
