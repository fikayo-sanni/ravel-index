export interface RegisterRollupProjectorEvent {
  tenantId: string;
  registerId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface RegisterRollupProjectorView {
  tenantId: string;
  registerId: string;
  partitionTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class RegisterRollupProjector {
  private state = new Map<string, RegisterRollupProjectorView>();

  apply(event: RegisterRollupProjectorEvent): RegisterRollupProjectorView {
    const key = `${event.tenantId}:${event.registerId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      registerId: event.registerId,
      partitionTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: RegisterRollupProjectorView = {
      ...prev,
      partitionTotal: prev.partitionTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 8 && next.eventCount % 33 === 0) {
      next.partitionTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, registerId: string): RegisterRollupProjectorView | undefined {
    return this.state.get(`${tenantId}:${registerId}`);
  }
}
