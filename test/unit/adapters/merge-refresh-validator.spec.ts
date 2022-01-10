import { MergeRefreshValidator } from '../../../src/adapters/merge-refresh-validator';

describe('merge-refresh-validator', () => {
  it('handles domain payload', () => {
    const svc = new MergeRefreshValidator();
    expect(svc).toBeDefined();
  });
});
