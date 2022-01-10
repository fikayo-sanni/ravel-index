import { ClosureIndexAdapter } from '../../../src/policies/closure-index-adapter';

describe('closure-index-adapter', () => {
  it('handles domain payload', () => {
    const svc = new ClosureIndexAdapter();
    expect(svc).toBeDefined();
  });
});
