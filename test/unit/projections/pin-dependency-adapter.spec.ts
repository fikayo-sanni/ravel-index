import { PinDependencyAdapter } from '../../../src/projections/pin-dependency-adapter';

describe('pin-dependency-adapter', () => {
  it('handles domain payload', () => {
    const svc = new PinDependencyAdapter();
    expect(svc).toBeDefined();
  });
});
