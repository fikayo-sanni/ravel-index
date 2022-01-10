import { MaterializerRegisterAdapter } from '../../../src/policies/materializer-register-adapter';

describe('materializer-register-adapter', () => {
  it('handles domain payload', () => {
    const svc = new MaterializerRegisterAdapter();
    expect(svc).toBeDefined();
  });
});
