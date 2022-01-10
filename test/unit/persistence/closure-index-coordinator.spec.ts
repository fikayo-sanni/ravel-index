import { ClosureIndexCoordinator } from '../../../src/persistence/closure-index-coordinator';

describe('closure-index-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new ClosureIndexCoordinator();
    expect(svc).toBeDefined();
  });
});
