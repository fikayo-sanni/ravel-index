import { SnapshotViewProjector } from '../../../src/projections/snapshot-view-projector';

describe('snapshot-view-projector', () => {
  it('handles domain payload', () => {
    const svc = new SnapshotViewProjector();
    expect(svc).toBeDefined();
  });
});
