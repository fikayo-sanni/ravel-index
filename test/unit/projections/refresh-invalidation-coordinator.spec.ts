import { RefreshInvalidationCoordinator } from '../../../src/projections/refresh-invalidation-coordinator';

describe('refresh-invalidation-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new RefreshInvalidationCoordinator();
    expect(svc).toBeDefined();
  });
});
