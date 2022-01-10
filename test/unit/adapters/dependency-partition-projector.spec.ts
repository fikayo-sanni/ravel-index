import { DependencyPartitionProjector } from '../../../src/adapters/dependency-partition-projector';

describe('dependency-partition-projector', () => {
  it('handles domain payload', () => {
    const svc = new DependencyPartitionProjector();
    expect(svc).toBeDefined();
  });
});
