export interface StreamVersionRepositoryContractRequest {
  tenantId: string;
  streamRef: string;
  mergeRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface StreamVersionRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeStreamVersionRepositoryContract(req: StreamVersionRepositoryContractRequest): StreamVersionRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeStreamVersionRepositoryContract(left: StreamVersionRepositoryContractResponse, right: StreamVersionRepositoryContractResponse): StreamVersionRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
