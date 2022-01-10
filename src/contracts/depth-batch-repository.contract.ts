export interface DepthBatchRepositoryContractRequest {
  tenantId: string;
  depthRef: string;
  streamRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DepthBatchRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDepthBatchRepositoryContract(req: DepthBatchRepositoryContractRequest): DepthBatchRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDepthBatchRepositoryContract(left: DepthBatchRepositoryContractResponse, right: DepthBatchRepositoryContractResponse): DepthBatchRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
