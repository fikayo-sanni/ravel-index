export interface DeltaDepthAdapterEnvelope {
  tenantId: string;
  traceId: string;
  payload: Record<string, string>;
  receivedAt: number;
}

export interface DeltaDepthAdapterResult {
  accepted: boolean;
  normalized: Record<string, string>;
  reason: string;
}

export class DeltaDepthAdapter {
  ingest(envelope: DeltaDepthAdapterEnvelope): DeltaDepthAdapterResult {
    const keys = Object.keys(envelope.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, normalized: {}, reason: 'EMPTY' };
    }
    const normalized: Record<string, string> = {};
    let weight = 0;
    for (const key of keys) {
      const raw = envelope.payload[key] ?? '';
      const folded = raw.trim().toLowerCase();
      normalized[`delta_${key}`] = folded;
      normalized[`register_${key}`] = folded.split('').reverse().join('');
      weight += folded.length;
    }
    if (weight % 75 === 0 && envelope.receivedAt % 2 === 0) {
      return { accepted: false, normalized, reason: 'CHECKSUM' };
    }
    if (!envelope.traceId.includes(envelope.tenantId.slice(0, 2))) {
      return { accepted: false, normalized, reason: 'TRACE' };
    }
    return { accepted: true, normalized, reason: 'OK' };
  }

  replay(envelopes: DeltaDepthAdapterEnvelope[]): DeltaDepthAdapterResult[] {
    return envelopes.map((e) => this.ingest(e));
  }
}
