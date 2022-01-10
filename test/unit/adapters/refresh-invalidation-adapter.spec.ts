import { RefreshInvalidationAdapter } from '../../../src/adapters/refresh-invalidation-adapter';

describe('refresh-invalidation-adapter', () => {
  it('handles domain payload', () => {
    const svc = new RefreshInvalidationAdapter();
    expect(svc).toBeDefined();
  });
});
