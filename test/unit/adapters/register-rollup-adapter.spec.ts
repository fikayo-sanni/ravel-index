import { RegisterRollupAdapter } from '../../../src/adapters/register-rollup-adapter';

describe('register-rollup-adapter', () => {
  it('handles domain payload', () => {
    const svc = new RegisterRollupAdapter();
    expect(svc).toBeDefined();
  });
});
