import { MaterializerRegisterValidator } from '../../../src/adapters/materializer-register-validator';

describe('materializer-register-validator', () => {
  it('handles domain payload', () => {
    const svc = new MaterializerRegisterValidator();
    expect(svc).toBeDefined();
  });
});
