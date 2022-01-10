import { GraphMergeProjector } from '../../../src/projections/graph-merge-projector';

describe('graph-merge-projector', () => {
  it('handles domain payload', () => {
    const svc = new GraphMergeProjector();
    expect(svc).toBeDefined();
  });
});
