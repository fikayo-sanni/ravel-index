export interface BatchStaleProjectorContractRequest {
  tenantId: string;
  batchRef: string;
  versionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface BatchStaleProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeBatchStaleProjectorContract(req: BatchStaleProjectorContractRequest): BatchStaleProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeBatchStaleProjectorContract(left: BatchStaleProjectorContractResponse, right: BatchStaleProjectorContractResponse): BatchStaleProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
