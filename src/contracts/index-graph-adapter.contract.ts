export interface IndexGraphAdapterContractRequest {
  tenantId: string;
  indexRef: string;
  dependencyRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface IndexGraphAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeIndexGraphAdapterContract(req: IndexGraphAdapterContractRequest): IndexGraphAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeIndexGraphAdapterContract(left: IndexGraphAdapterContractResponse, right: IndexGraphAdapterContractResponse): IndexGraphAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
