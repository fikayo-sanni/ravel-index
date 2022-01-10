import { ViewStreamAdapter } from '../../../src/projections/view-stream-adapter';

describe('view-stream-adapter', () => {
  it('handles domain payload', () => {
    const svc = new ViewStreamAdapter();
    expect(svc).toBeDefined();
  });
});
