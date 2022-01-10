export interface BatchStaleRepositoryContractRequest {
  tenantId: string;
  batchRef: string;
  versionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface BatchStaleRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeBatchStaleRepositoryContract(req: BatchStaleRepositoryContractRequest): BatchStaleRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeBatchStaleRepositoryContract(left: BatchStaleRepositoryContractResponse, right: BatchStaleRepositoryContractResponse): BatchStaleRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
