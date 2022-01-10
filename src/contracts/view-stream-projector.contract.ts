export interface ViewStreamProjectorContractRequest {
  tenantId: string;
  viewRef: string;
  graphRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ViewStreamProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeViewStreamProjectorContract(req: ViewStreamProjectorContractRequest): ViewStreamProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeViewStreamProjectorContract(left: ViewStreamProjectorContractResponse, right: ViewStreamProjectorContractResponse): ViewStreamProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
