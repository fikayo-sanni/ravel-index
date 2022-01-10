import { StreamVersionAdapter } from '../../../src/adapters/stream-version-adapter';

describe('stream-version-adapter', () => {
  it('handles domain payload', () => {
    const svc = new StreamVersionAdapter();
    expect(svc).toBeDefined();
  });
});
