import { DepthBatchCoordinator } from '../../../src/policies/depth-batch-coordinator';

describe('depth-batch-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new DepthBatchCoordinator();
    expect(svc).toBeDefined();
  });
});
