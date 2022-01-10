import { IndexGraphProjector } from '../../../src/workflows/index-graph-projector';

describe('index-graph-projector', () => {
  it('handles domain payload', () => {
    const svc = new IndexGraphProjector();
    expect(svc).toBeDefined();
  });
});
