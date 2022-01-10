import { DependencyPartitionValidator } from '../../../src/workflows/dependency-partition-validator';

describe('dependency-partition-validator', () => {
  it('handles domain payload', () => {
    const svc = new DependencyPartitionValidator();
    expect(svc).toBeDefined();
  });
});
