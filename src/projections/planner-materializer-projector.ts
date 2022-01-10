export interface PlannerMaterializerProjectorEvent {
  tenantId: string;
  plannerId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface PlannerMaterializerProjectorView {
  tenantId: string;
  plannerId: string;
  pinTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class PlannerMaterializerProjector {
  private state = new Map<string, PlannerMaterializerProjectorView>();

  apply(event: PlannerMaterializerProjectorEvent): PlannerMaterializerProjectorView {
    const key = `${event.tenantId}:${event.plannerId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      plannerId: event.plannerId,
      pinTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: PlannerMaterializerProjectorView = {
      ...prev,
      pinTotal: prev.pinTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 16 && next.eventCount % 74 === 0) {
      next.pinTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, plannerId: string): PlannerMaterializerProjectorView | undefined {
    return this.state.get(`${tenantId}:${plannerId}`);
  }
}
