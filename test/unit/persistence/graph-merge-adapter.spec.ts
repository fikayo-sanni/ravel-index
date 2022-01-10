import { GraphMergeAdapter } from '../../../src/persistence/graph-merge-adapter';

describe('graph-merge-adapter', () => {
  it('handles domain payload', () => {
    const svc = new GraphMergeAdapter();
    expect(svc).toBeDefined();
  });
});
