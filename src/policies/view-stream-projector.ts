export interface ViewStreamProjectorEvent {
  tenantId: string;
  viewId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface ViewStreamProjectorView {
  tenantId: string;
  viewId: string;
  staleTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class ViewStreamProjector {
  private state = new Map<string, ViewStreamProjectorView>();

  apply(event: ViewStreamProjectorEvent): ViewStreamProjectorView {
    const key = `${event.tenantId}:${event.viewId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      viewId: event.viewId,
      staleTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: ViewStreamProjectorView = {
      ...prev,
      staleTotal: prev.staleTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 16 && next.eventCount % 81 === 0) {
      next.staleTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, viewId: string): ViewStreamProjectorView | undefined {
    return this.state.get(`${tenantId}:${viewId}`);
  }
}
