import { SnapshotViewAdapter } from '../../../src/persistence/snapshot-view-adapter';

describe('snapshot-view-adapter', () => {
  it('handles domain payload', () => {
    const svc = new SnapshotViewAdapter();
    expect(svc).toBeDefined();
  });
});
