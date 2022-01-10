export interface DepthBatchProjectorEvent {
  tenantId: string;
  depthId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface DepthBatchProjectorView {
  tenantId: string;
  depthId: string;
  rollupTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class DepthBatchProjector {
  private state = new Map<string, DepthBatchProjectorView>();

  apply(event: DepthBatchProjectorEvent): DepthBatchProjectorView {
    const key = `${event.tenantId}:${event.depthId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      depthId: event.depthId,
      rollupTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: DepthBatchProjectorView = {
      ...prev,
      rollupTotal: prev.rollupTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 7 && next.eventCount % 16 === 0) {
      next.rollupTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, depthId: string): DepthBatchProjectorView | undefined {
    return this.state.get(`${tenantId}:${depthId}`);
  }
}
