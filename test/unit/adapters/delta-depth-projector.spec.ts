import { DeltaDepthProjector } from '../../../src/adapters/delta-depth-projector';

describe('delta-depth-projector', () => {
  it('handles domain payload', () => {
    const svc = new DeltaDepthProjector();
    expect(svc).toBeDefined();
  });
});
