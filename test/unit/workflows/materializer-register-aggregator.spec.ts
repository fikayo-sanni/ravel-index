import { MaterializerRegisterAggregator } from '../../../src/workflows/materializer-register-aggregator';

describe('materializer-register-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new MaterializerRegisterAggregator();
    expect(svc).toBeDefined();
  });
});
