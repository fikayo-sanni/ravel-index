import { RegisterRollupCoordinator } from '../../../src/projections/register-rollup-coordinator';

describe('register-rollup-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new RegisterRollupCoordinator();
    expect(svc).toBeDefined();
  });
});
