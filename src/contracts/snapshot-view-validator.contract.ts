export interface SnapshotViewValidatorContractRequest {
  tenantId: string;
  snapshotRef: string;
  indexRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface SnapshotViewValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeSnapshotViewValidatorContract(req: SnapshotViewValidatorContractRequest): SnapshotViewValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeSnapshotViewValidatorContract(left: SnapshotViewValidatorContractResponse, right: SnapshotViewValidatorContractResponse): SnapshotViewValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
