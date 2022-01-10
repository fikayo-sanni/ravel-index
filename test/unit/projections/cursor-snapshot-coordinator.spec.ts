import { CursorSnapshotCoordinator } from '../../../src/projections/cursor-snapshot-coordinator';

describe('cursor-snapshot-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new CursorSnapshotCoordinator();
    expect(svc).toBeDefined();
  });
});
