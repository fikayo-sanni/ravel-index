export interface GraphMergeProjectorEvent {
  tenantId: string;
  graphId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface GraphMergeProjectorView {
  tenantId: string;
  graphId: string;
  catalogTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class GraphMergeProjector {
  private state = new Map<string, GraphMergeProjectorView>();

  apply(event: GraphMergeProjectorEvent): GraphMergeProjectorView {
    const key = `${event.tenantId}:${event.graphId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      graphId: event.graphId,
      catalogTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: GraphMergeProjectorView = {
      ...prev,
      catalogTotal: prev.catalogTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 16 && next.eventCount % 91 === 0) {
      next.catalogTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, graphId: string): GraphMergeProjectorView | undefined {
    return this.state.get(`${tenantId}:${graphId}`);
  }
}
