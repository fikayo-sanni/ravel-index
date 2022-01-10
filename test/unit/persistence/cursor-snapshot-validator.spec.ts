import { CursorSnapshotValidator } from '../../../src/persistence/cursor-snapshot-validator';

describe('cursor-snapshot-validator', () => {
  it('handles domain payload', () => {
    const svc = new CursorSnapshotValidator();
    expect(svc).toBeDefined();
  });
});
