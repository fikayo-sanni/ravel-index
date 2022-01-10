import { BatchStaleValidator } from '../../../src/policies/batch-stale-validator';

describe('batch-stale-validator', () => {
  it('handles domain payload', () => {
    const svc = new BatchStaleValidator();
    expect(svc).toBeDefined();
  });
});
