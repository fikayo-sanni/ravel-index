export interface ClosureIndexAggregatorContractRequest {
  tenantId: string;
  closureRef: string;
  pinRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ClosureIndexAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeClosureIndexAggregatorContract(req: ClosureIndexAggregatorContractRequest): ClosureIndexAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeClosureIndexAggregatorContract(left: ClosureIndexAggregatorContractResponse, right: ClosureIndexAggregatorContractResponse): ClosureIndexAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
