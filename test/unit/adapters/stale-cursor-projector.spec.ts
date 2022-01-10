import { StaleCursorProjector } from '../../../src/adapters/stale-cursor-projector';

describe('stale-cursor-projector', () => {
  it('handles domain payload', () => {
    const svc = new StaleCursorProjector();
    expect(svc).toBeDefined();
  });
});
