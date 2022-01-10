export interface InvalidationPinAggregatorContractRequest {
  tenantId: string;
  invalidationRef: string;
  registerRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface InvalidationPinAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeInvalidationPinAggregatorContract(req: InvalidationPinAggregatorContractRequest): InvalidationPinAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeInvalidationPinAggregatorContract(left: InvalidationPinAggregatorContractResponse, right: InvalidationPinAggregatorContractResponse): InvalidationPinAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
