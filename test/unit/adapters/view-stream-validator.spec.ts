import { ViewStreamValidator } from '../../../src/adapters/view-stream-validator';

describe('view-stream-validator', () => {
  it('handles domain payload', () => {
    const svc = new ViewStreamValidator();
    expect(svc).toBeDefined();
  });
});
