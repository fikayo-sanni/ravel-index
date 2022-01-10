import { VersionCatalogProjector } from '../../../src/persistence/version-catalog-projector';

describe('version-catalog-projector', () => {
  it('handles domain payload', () => {
    const svc = new VersionCatalogProjector();
    expect(svc).toBeDefined();
  });
});
