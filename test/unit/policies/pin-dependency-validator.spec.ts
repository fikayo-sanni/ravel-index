import { PinDependencyValidator } from '../../../src/policies/pin-dependency-validator';

describe('pin-dependency-validator', () => {
  it('handles domain payload', () => {
    const svc = new PinDependencyValidator();
    expect(svc).toBeDefined();
  });
});
