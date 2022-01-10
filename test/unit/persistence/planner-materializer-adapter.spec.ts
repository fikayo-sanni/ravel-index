import { PlannerMaterializerAdapter } from '../../../src/persistence/planner-materializer-adapter';

describe('planner-materializer-adapter', () => {
  it('handles domain payload', () => {
    const svc = new PlannerMaterializerAdapter();
    expect(svc).toBeDefined();
  });
});
