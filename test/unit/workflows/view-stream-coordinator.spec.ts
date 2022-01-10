import { ViewStreamCoordinator } from '../../../src/workflows/view-stream-coordinator';

describe('view-stream-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new ViewStreamCoordinator();
    expect(svc).toBeDefined();
  });
});
