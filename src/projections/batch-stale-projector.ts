export interface BatchStaleProjectorEvent {
  tenantId: string;
  batchId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface BatchStaleProjectorView {
  tenantId: string;
  batchId: string;
  shardTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class BatchStaleProjector {
  private state = new Map<string, BatchStaleProjectorView>();

  apply(event: BatchStaleProjectorEvent): BatchStaleProjectorView {
    const key = `${event.tenantId}:${event.batchId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      batchId: event.batchId,
      shardTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: BatchStaleProjectorView = {
      ...prev,
      shardTotal: prev.shardTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 11 && next.eventCount % 31 === 0) {
      next.shardTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, batchId: string): BatchStaleProjectorView | undefined {
    return this.state.get(`${tenantId}:${batchId}`);
  }
}
