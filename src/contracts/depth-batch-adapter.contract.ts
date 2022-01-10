export interface DepthBatchAdapterContractRequest {
  tenantId: string;
  depthRef: string;
  streamRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DepthBatchAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDepthBatchAdapterContract(req: DepthBatchAdapterContractRequest): DepthBatchAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDepthBatchAdapterContract(left: DepthBatchAdapterContractResponse, right: DepthBatchAdapterContractResponse): DepthBatchAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
