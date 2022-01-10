import { BatchStaleProjector } from '../../../src/projections/batch-stale-projector';

describe('batch-stale-projector', () => {
  it('handles domain payload', () => {
    const svc = new BatchStaleProjector();
    expect(svc).toBeDefined();
  });
});
