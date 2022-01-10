import { CursorSnapshotProjector } from '../../../src/workflows/cursor-snapshot-projector';

describe('cursor-snapshot-projector', () => {
  it('handles domain payload', () => {
    const svc = new CursorSnapshotProjector();
    expect(svc).toBeDefined();
  });
});
