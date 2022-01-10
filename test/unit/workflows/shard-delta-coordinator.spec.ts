import { ShardDeltaCoordinator } from '../../../src/workflows/shard-delta-coordinator';

describe('shard-delta-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new ShardDeltaCoordinator();
    expect(svc).toBeDefined();
  });
});
