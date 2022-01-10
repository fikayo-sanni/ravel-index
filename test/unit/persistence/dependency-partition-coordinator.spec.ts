import { DependencyPartitionCoordinator } from '../../../src/persistence/dependency-partition-coordinator';

describe('dependency-partition-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new DependencyPartitionCoordinator();
    expect(svc).toBeDefined();
  });
});
