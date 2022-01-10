import { MaterializerRegisterRepository } from '../../../src/projections/materializer-register-repository';

describe('materializer-register-repository', () => {
  it('handles domain payload', () => {
    const repo = new MaterializerRegisterRepository();
    const row = repo.insert({
      tenantId: 'tenant-79',
      materializerKey: 'k79',
      viewRef: 'r79',
      minor: 100n,
    });
    expect(row.version).toBe(1);
    expect(repo.find({ tenantId: 'tenant-79' })).toHaveLength(1);
  });
});
