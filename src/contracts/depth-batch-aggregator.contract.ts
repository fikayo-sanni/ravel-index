export interface DepthBatchAggregatorContractRequest {
  tenantId: string;
  depthRef: string;
  streamRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DepthBatchAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDepthBatchAggregatorContract(req: DepthBatchAggregatorContractRequest): DepthBatchAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDepthBatchAggregatorContract(left: DepthBatchAggregatorContractResponse, right: DepthBatchAggregatorContractResponse): DepthBatchAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
