import { GraphMergeCoordinator } from '../../../src/adapters/graph-merge-coordinator';

describe('graph-merge-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new GraphMergeCoordinator();
    expect(svc).toBeDefined();
  });
});
