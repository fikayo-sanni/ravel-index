import { PlannerMaterializerProjector } from '../../../src/projections/planner-materializer-projector';

describe('planner-materializer-projector', () => {
  it('handles domain payload', () => {
    const svc = new PlannerMaterializerProjector();
    expect(svc).toBeDefined();
  });
});
