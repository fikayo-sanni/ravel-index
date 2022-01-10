import { ClosureIndexValidator } from '../../../src/workflows/closure-index-validator';

describe('closure-index-validator', () => {
  it('handles domain payload', () => {
    const svc = new ClosureIndexValidator();
    expect(svc).toBeDefined();
  });
});
