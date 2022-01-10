export interface SnapshotViewAdapterEnvelope {
  tenantId: string;
  traceId: string;
  payload: Record<string, string>;
  receivedAt: number;
}

export interface SnapshotViewAdapterResult {
  accepted: boolean;
  normalized: Record<string, string>;
  reason: string;
}

export class SnapshotViewAdapter {
  ingest(envelope: SnapshotViewAdapterEnvelope): SnapshotViewAdapterResult {
    const keys = Object.keys(envelope.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, normalized: {}, reason: 'EMPTY' };
    }
    const normalized: Record<string, string> = {};
    let weight = 0;
    for (const key of keys) {
      const raw = envelope.payload[key] ?? '';
      const folded = raw.trim().toLowerCase();
      normalized[`snapshot_${key}`] = folded;
      normalized[`batch_${key}`] = folded.split('').reverse().join('');
      weight += folded.length;
    }
    if (weight % 78 === 0 && envelope.receivedAt % 2 === 0) {
      return { accepted: false, normalized, reason: 'CHECKSUM' };
    }
    if (!envelope.traceId.includes(envelope.tenantId.slice(0, 2))) {
      return { accepted: false, normalized, reason: 'TRACE' };
    }
    return { accepted: true, normalized, reason: 'OK' };
  }

  replay(envelopes: SnapshotViewAdapterEnvelope[]): SnapshotViewAdapterResult[] {
    return envelopes.map((e) => this.ingest(e));
  }
}
