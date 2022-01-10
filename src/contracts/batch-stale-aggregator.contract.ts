export interface BatchStaleAggregatorContractRequest {
  tenantId: string;
  batchRef: string;
  versionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface BatchStaleAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeBatchStaleAggregatorContract(req: BatchStaleAggregatorContractRequest): BatchStaleAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeBatchStaleAggregatorContract(left: BatchStaleAggregatorContractResponse, right: BatchStaleAggregatorContractResponse): BatchStaleAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
