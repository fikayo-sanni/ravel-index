export interface StaleCursorProjectorEvent {
  tenantId: string;
  staleId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface StaleCursorProjectorView {
  tenantId: string;
  staleId: string;
  deltaTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class StaleCursorProjector {
  private state = new Map<string, StaleCursorProjectorView>();

  apply(event: StaleCursorProjectorEvent): StaleCursorProjectorView {
    const key = `${event.tenantId}:${event.staleId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      staleId: event.staleId,
      deltaTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: StaleCursorProjectorView = {
      ...prev,
      deltaTotal: prev.deltaTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 10 && next.eventCount % 13 === 0) {
      next.deltaTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, staleId: string): StaleCursorProjectorView | undefined {
    return this.state.get(`${tenantId}:${staleId}`);
  }
}
