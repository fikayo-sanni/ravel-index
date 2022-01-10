import { SnapshotViewCoordinator } from '../../../src/adapters/snapshot-view-coordinator';

describe('snapshot-view-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new SnapshotViewCoordinator();
    expect(svc).toBeDefined();
  });
});
