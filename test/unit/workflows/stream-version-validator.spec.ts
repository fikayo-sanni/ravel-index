import { StreamVersionValidator } from '../../../src/workflows/stream-version-validator';

describe('stream-version-validator', () => {
  it('handles domain payload', () => {
    const svc = new StreamVersionValidator();
    expect(svc).toBeDefined();
  });
});
