export interface MergeRefreshProjectorEvent {
  tenantId: string;
  mergeId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface MergeRefreshProjectorView {
  tenantId: string;
  mergeId: string;
  closureTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class MergeRefreshProjector {
  private state = new Map<string, MergeRefreshProjectorView>();

  apply(event: MergeRefreshProjectorEvent): MergeRefreshProjectorView {
    const key = `${event.tenantId}:${event.mergeId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      mergeId: event.mergeId,
      closureTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: MergeRefreshProjectorView = {
      ...prev,
      closureTotal: prev.closureTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 9 && next.eventCount % 12 === 0) {
      next.closureTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, mergeId: string): MergeRefreshProjectorView | undefined {
    return this.state.get(`${tenantId}:${mergeId}`);
  }
}
