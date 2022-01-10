import { DeltaDepthValidator } from '../../../src/workflows/delta-depth-validator';

describe('delta-depth-validator', () => {
  it('handles domain payload', () => {
    const svc = new DeltaDepthValidator();
    expect(svc).toBeDefined();
  });
});
