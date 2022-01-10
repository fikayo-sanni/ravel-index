export interface SnapshotViewAdapterContractRequest {
  tenantId: string;
  snapshotRef: string;
  indexRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface SnapshotViewAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeSnapshotViewAdapterContract(req: SnapshotViewAdapterContractRequest): SnapshotViewAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeSnapshotViewAdapterContract(left: SnapshotViewAdapterContractResponse, right: SnapshotViewAdapterContractResponse): SnapshotViewAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
