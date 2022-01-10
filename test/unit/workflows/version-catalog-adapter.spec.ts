import { VersionCatalogAdapter } from '../../../src/workflows/version-catalog-adapter';

describe('version-catalog-adapter', () => {
  it('handles domain payload', () => {
    const svc = new VersionCatalogAdapter();
    expect(svc).toBeDefined();
  });
});
