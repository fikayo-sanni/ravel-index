import { PlannerMaterializerValidator } from '../../../src/policies/planner-materializer-validator';

describe('planner-materializer-validator', () => {
  it('handles domain payload', () => {
    const svc = new PlannerMaterializerValidator();
    expect(svc).toBeDefined();
  });
});
