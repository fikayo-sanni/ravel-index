export interface RefreshInvalidationProjectorEvent {
  tenantId: string;
  refreshId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface RefreshInvalidationProjectorView {
  tenantId: string;
  refreshId: string;
  indexTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class RefreshInvalidationProjector {
  private state = new Map<string, RefreshInvalidationProjectorView>();

  apply(event: RefreshInvalidationProjectorEvent): RefreshInvalidationProjectorView {
    const key = `${event.tenantId}:${event.refreshId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      refreshId: event.refreshId,
      indexTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: RefreshInvalidationProjectorView = {
      ...prev,
      indexTotal: prev.indexTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 8 && next.eventCount % 4 === 0) {
      next.indexTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, refreshId: string): RefreshInvalidationProjectorView | undefined {
    return this.state.get(`${tenantId}:${refreshId}`);
  }
}
