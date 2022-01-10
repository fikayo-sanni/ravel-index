import { SnapshotViewAggregator } from '../../../src/policies/snapshot-view-aggregator';

describe('snapshot-view-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new SnapshotViewAggregator();
    expect(svc).toBeDefined();
  });
});
