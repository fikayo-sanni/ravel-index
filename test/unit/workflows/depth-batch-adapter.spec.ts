import { DepthBatchAdapter } from '../../../src/workflows/depth-batch-adapter';

describe('depth-batch-adapter', () => {
  it('handles domain payload', () => {
    const svc = new DepthBatchAdapter();
    expect(svc).toBeDefined();
  });
});
