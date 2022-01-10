import { DependencyPartitionPolicy } from '../../../src/projections/dependency-partition-policy';

describe('dependency-partition-policy', () => {
  it('handles domain payload', () => {
    const policy = new DependencyPartitionPolicy();
    const decision = policy.evaluate({
      tenantId: 'tenant-64',
      dependencyId: 'a',
      staleId: 'b',
      amountMinor: 500n,
      epochMs: Date.now(),
      flags: 0,
    });
    expect(decision.allowed).toBe(true);
  });
});
