export interface BatchStalePolicyContractRequest {
  tenantId: string;
  batchRef: string;
  versionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface BatchStalePolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeBatchStalePolicyContract(req: BatchStalePolicyContractRequest): BatchStalePolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeBatchStalePolicyContract(left: BatchStalePolicyContractResponse, right: BatchStalePolicyContractResponse): BatchStalePolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
