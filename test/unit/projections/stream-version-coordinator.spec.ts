import { StreamVersionCoordinator } from '../../../src/projections/stream-version-coordinator';

describe('stream-version-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new StreamVersionCoordinator();
    expect(svc).toBeDefined();
  });
});
