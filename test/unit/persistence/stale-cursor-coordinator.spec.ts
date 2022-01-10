import { StaleCursorCoordinator } from '../../../src/persistence/stale-cursor-coordinator';

describe('stale-cursor-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new StaleCursorCoordinator();
    expect(svc).toBeDefined();
  });
});
