import { IndexGraphValidator } from '../../../src/persistence/index-graph-validator';

describe('index-graph-validator', () => {
  it('handles domain payload', () => {
    const svc = new IndexGraphValidator();
    expect(svc).toBeDefined();
  });
});
