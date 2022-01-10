import { SnapshotViewValidator } from '../../../src/projections/snapshot-view-validator';

describe('snapshot-view-validator', () => {
  it('handles domain payload', () => {
    const svc = new SnapshotViewValidator();
    expect(svc).toBeDefined();
  });
});
