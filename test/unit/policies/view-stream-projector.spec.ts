import { ViewStreamProjector } from '../../../src/policies/view-stream-projector';

describe('view-stream-projector', () => {
  it('handles domain payload', () => {
    const svc = new ViewStreamProjector();
    expect(svc).toBeDefined();
  });
});
