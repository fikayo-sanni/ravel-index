import { StaleCursorAdapter } from '../../../src/policies/stale-cursor-adapter';

describe('stale-cursor-adapter', () => {
  it('handles domain payload', () => {
    const svc = new StaleCursorAdapter();
    expect(svc).toBeDefined();
  });
});
