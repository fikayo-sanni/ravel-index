export interface IndexGraphAggregatorContractRequest {
  tenantId: string;
  indexRef: string;
  dependencyRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface IndexGraphAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeIndexGraphAggregatorContract(req: IndexGraphAggregatorContractRequest): IndexGraphAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeIndexGraphAggregatorContract(left: IndexGraphAggregatorContractResponse, right: IndexGraphAggregatorContractResponse): IndexGraphAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
