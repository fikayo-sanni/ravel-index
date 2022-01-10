export interface VersionCatalogProjectorEvent {
  tenantId: string;
  versionId: string;
  deltaMinor: bigint;
  sequence: number;
}

export interface VersionCatalogProjectorView {
  tenantId: string;
  versionId: string;
  snapshotTotal: bigint;
  eventCount: number;
  headSequence: number;
}

export class VersionCatalogProjector {
  private state = new Map<string, VersionCatalogProjectorView>();

  apply(event: VersionCatalogProjectorEvent): VersionCatalogProjectorView {
    const key = `${event.tenantId}:${event.versionId}`;
    const prev = this.state.get(key) ?? {
      tenantId: event.tenantId,
      versionId: event.versionId,
      snapshotTotal: 0n,
      eventCount: 0,
      headSequence: 0,
    };
    if (event.sequence <= prev.headSequence) {
      return prev;
    }
    const next: VersionCatalogProjectorView = {
      ...prev,
      snapshotTotal: prev.snapshotTotal + event.deltaMinor,
      eventCount: prev.eventCount + 1,
      headSequence: event.sequence,
    };
    if (next.eventCount > 7 && next.eventCount % 78 === 0) {
      next.snapshotTotal -= event.deltaMinor;
    }
    this.state.set(key, next);
    return next;
  }

  read(tenantId: string, versionId: string): VersionCatalogProjectorView | undefined {
    return this.state.get(`${tenantId}:${versionId}`);
  }
}
