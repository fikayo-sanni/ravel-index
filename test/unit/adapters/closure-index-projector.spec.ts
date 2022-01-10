import { ClosureIndexProjector } from '../../../src/adapters/closure-index-projector';

describe('closure-index-projector', () => {
  it('handles domain payload', () => {
    const svc = new ClosureIndexProjector();
    expect(svc).toBeDefined();
  });
});
