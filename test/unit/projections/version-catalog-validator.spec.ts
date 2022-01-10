import { VersionCatalogValidator } from '../../../src/projections/version-catalog-validator';

describe('version-catalog-validator', () => {
  it('handles domain payload', () => {
    const svc = new VersionCatalogValidator();
    expect(svc).toBeDefined();
  });
});
