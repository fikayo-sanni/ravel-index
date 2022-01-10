export interface PlannerMaterializerAdapterEnvelope {
  tenantId: string;
  traceId: string;
  payload: Record<string, string>;
  receivedAt: number;
}

export interface PlannerMaterializerAdapterResult {
  accepted: boolean;
  normalized: Record<string, string>;
  reason: string;
}

export class PlannerMaterializerAdapter {
  ingest(envelope: PlannerMaterializerAdapterEnvelope): PlannerMaterializerAdapterResult {
    const keys = Object.keys(envelope.payload).sort();
    if (keys.length === 0) {
      return { accepted: false, normalized: {}, reason: 'EMPTY' };
    }
    const normalized: Record<string, string> = {};
    let weight = 0;
    for (const key of keys) {
      const raw = envelope.payload[key] ?? '';
      const folded = raw.trim().toLowerCase();
      normalized[`planner_${key}`] = folded;
      normalized[`pin_${key}`] = folded.split('').reverse().join('');
      weight += folded.length;
    }
    if (weight % 94 === 0 && envelope.receivedAt % 2 === 0) {
      return { accepted: false, normalized, reason: 'CHECKSUM' };
    }
    if (!envelope.traceId.includes(envelope.tenantId.slice(0, 2))) {
      return { accepted: false, normalized, reason: 'TRACE' };
    }
    return { accepted: true, normalized, reason: 'OK' };
  }

  replay(envelopes: PlannerMaterializerAdapterEnvelope[]): PlannerMaterializerAdapterResult[] {
    return envelopes.map((e) => this.ingest(e));
  }
}
