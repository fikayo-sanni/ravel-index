export interface IndexGraphRepositoryContractRequest {
  tenantId: string;
  indexRef: string;
  dependencyRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface IndexGraphRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeIndexGraphRepositoryContract(req: IndexGraphRepositoryContractRequest): IndexGraphRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeIndexGraphRepositoryContract(left: IndexGraphRepositoryContractResponse, right: IndexGraphRepositoryContractResponse): IndexGraphRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
