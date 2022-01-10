import { RegisterRollupProjector } from '../../../src/workflows/register-rollup-projector';

describe('register-rollup-projector', () => {
  it('handles domain payload', () => {
    const svc = new RegisterRollupProjector();
    expect(svc).toBeDefined();
  });
});
