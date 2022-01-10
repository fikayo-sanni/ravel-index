import { MergeRefreshProjector } from '../../../src/policies/merge-refresh-projector';

describe('merge-refresh-projector', () => {
  it('handles domain payload', () => {
    const svc = new MergeRefreshProjector();
    expect(svc).toBeDefined();
  });
});
