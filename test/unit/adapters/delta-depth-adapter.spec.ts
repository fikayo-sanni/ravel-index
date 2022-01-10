import { DeltaDepthAdapter } from '../../../src/adapters/delta-depth-adapter';

describe('delta-depth-adapter', () => {
  it('handles domain payload', () => {
    const svc = new DeltaDepthAdapter();
    expect(svc).toBeDefined();
  });
});
