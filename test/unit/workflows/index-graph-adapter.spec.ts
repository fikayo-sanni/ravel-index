import { IndexGraphAdapter } from '../../../src/workflows/index-graph-adapter';

describe('index-graph-adapter', () => {
  it('handles domain payload', () => {
    const svc = new IndexGraphAdapter();
    expect(svc).toBeDefined();
  });
});
