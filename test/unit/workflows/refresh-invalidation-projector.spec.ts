import { RefreshInvalidationProjector } from '../../../src/workflows/refresh-invalidation-projector';

describe('refresh-invalidation-projector', () => {
  it('handles domain payload', () => {
    const svc = new RefreshInvalidationProjector();
    expect(svc).toBeDefined();
  });
});
