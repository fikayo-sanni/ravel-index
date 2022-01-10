export interface CursorSnapshotProjectorEvent {
  tenantId: string;
  cursorId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface CursorSnapshotProjectorView {
  tenantId: string;
  cursorId: string;
  depthTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class CursorSnapshotProjector {
  private state = new Map<string, CursorSnapshotProjectorView>();

  apply(event: CursorSnapshotProjectorEvent): CursorSnapshotProjectorView {
    const key = `${event.tenantId}:${event.cursorId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      cursorId: event.cursorId,
      depthTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: CursorSnapshotProjectorView = {
      ...prev,
      depthTotal: prev.depthTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 10 && next.eventCount % 2 === 0) {
      next.depthTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, cursorId: string): CursorSnapshotProjectorView | undefined {
    return this.state.get(`${tenantId}:${cursorId}`);
  }
}
