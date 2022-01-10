export interface DepthBatchProjectorContractRequest {
  tenantId: string;
  depthRef: string;
  streamRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DepthBatchProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDepthBatchProjectorContract(req: DepthBatchProjectorContractRequest): DepthBatchProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDepthBatchProjectorContract(left: DepthBatchProjectorContractResponse, right: DepthBatchProjectorContractResponse): DepthBatchProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
