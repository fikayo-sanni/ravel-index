export interface ViewStreamCoordinatorContractRequest {
  tenantId: string;
  viewRef: string;
  graphRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ViewStreamCoordinatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeViewStreamCoordinatorContract(req: ViewStreamCoordinatorContractRequest): ViewStreamCoordinatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeViewStreamCoordinatorContract(left: ViewStreamCoordinatorContractResponse, right: ViewStreamCoordinatorContractResponse): ViewStreamCoordinatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
