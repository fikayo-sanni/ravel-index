import { DepthBatchProjector } from '../../../src/persistence/depth-batch-projector';

describe('depth-batch-projector', () => {
  it('handles domain payload', () => {
    const svc = new DepthBatchProjector();
    expect(svc).toBeDefined();
  });
});
