export interface ShardDeltaProjectorEvent {
  tenantId: string;
  shardId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface ShardDeltaProjectorView {
  tenantId: string;
  shardId: string;
  materializerTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class ShardDeltaProjector {
  private state = new Map<string, ShardDeltaProjectorView>();

  apply(event: ShardDeltaProjectorEvent): ShardDeltaProjectorView {
    const key = `${event.tenantId}:${event.shardId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      shardId: event.shardId,
      materializerTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: ShardDeltaProjectorView = {
      ...prev,
      materializerTotal: prev.materializerTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 11 && next.eventCount % 10 === 0) {
      next.materializerTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, shardId: string): ShardDeltaProjectorView | undefined {
    return this.state.get(`${tenantId}:${shardId}`);
  }
}
