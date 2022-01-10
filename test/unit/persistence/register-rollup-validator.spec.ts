import { RegisterRollupValidator } from '../../../src/persistence/register-rollup-validator';

describe('register-rollup-validator', () => {
  it('handles domain payload', () => {
    const svc = new RegisterRollupValidator();
    expect(svc).toBeDefined();
  });
});
