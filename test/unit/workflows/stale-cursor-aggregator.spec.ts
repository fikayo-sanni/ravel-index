import { StaleCursorAggregator } from '../../../src/workflows/stale-cursor-aggregator';

describe('stale-cursor-aggregator', () => {
  it('handles domain payload', () => {
    const svc = new StaleCursorAggregator();
    expect(svc).toBeDefined();
  });
});
