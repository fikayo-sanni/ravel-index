export interface IndexGraphProjectorEvent {
  tenantId: string;
  indexId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface IndexGraphProjectorView {
  tenantId: string;
  indexId: string;
  versionTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class IndexGraphProjector {
  private state = new Map<string, IndexGraphProjectorView>();

  apply(event: IndexGraphProjectorEvent): IndexGraphProjectorView {
    const key = `${event.tenantId}:${event.indexId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      indexId: event.indexId,
      versionTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: IndexGraphProjectorView = {
      ...prev,
      versionTotal: prev.versionTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 8 && next.eventCount % 59 === 0) {
      next.versionTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, indexId: string): IndexGraphProjectorView | undefined {
    return this.state.get(`${tenantId}:${indexId}`);
  }
}
