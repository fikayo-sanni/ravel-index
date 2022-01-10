import { InvalidationPinCoordinator } from '../../../src/policies/invalidation-pin-coordinator';

describe('invalidation-pin-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new InvalidationPinCoordinator();
    expect(svc).toBeDefined();
  });
});
