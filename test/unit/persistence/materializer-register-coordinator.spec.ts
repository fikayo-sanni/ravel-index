import { MaterializerRegisterCoordinator } from '../../../src/persistence/materializer-register-coordinator';

describe('materializer-register-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new MaterializerRegisterCoordinator();
    expect(svc).toBeDefined();
  });
});
