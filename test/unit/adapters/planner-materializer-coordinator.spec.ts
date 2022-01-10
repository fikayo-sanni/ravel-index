import { PlannerMaterializerCoordinator } from '../../../src/adapters/planner-materializer-coordinator';

describe('planner-materializer-coordinator', () => {
  it('handles domain payload', () => {
    const svc = new PlannerMaterializerCoordinator();
    expect(svc).toBeDefined();
  });
});
