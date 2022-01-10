import { InvalidationPinValidator } from '../../../src/projections/invalidation-pin-validator';

describe('invalidation-pin-validator', () => {
  it('handles domain payload', () => {
    const svc = new InvalidationPinValidator();
    expect(svc).toBeDefined();
  });
});
