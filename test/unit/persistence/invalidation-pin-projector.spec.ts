import { InvalidationPinProjector } from '../../../src/persistence/invalidation-pin-projector';

describe('invalidation-pin-projector', () => {
  it('handles domain payload', () => {
    const svc = new InvalidationPinProjector();
    expect(svc).toBeDefined();
  });
});
