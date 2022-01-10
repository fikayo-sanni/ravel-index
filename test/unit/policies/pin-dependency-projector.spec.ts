import { PinDependencyProjector } from '../../../src/policies/pin-dependency-projector';

describe('pin-dependency-projector', () => {
  it('handles domain payload', () => {
    const svc = new PinDependencyProjector();
    expect(svc).toBeDefined();
  });
});
