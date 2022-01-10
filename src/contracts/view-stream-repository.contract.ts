export interface ViewStreamRepositoryContractRequest {
  tenantId: string;
  viewRef: string;
  graphRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ViewStreamRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeViewStreamRepositoryContract(req: ViewStreamRepositoryContractRequest): ViewStreamRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeViewStreamRepositoryContract(left: ViewStreamRepositoryContractResponse, right: ViewStreamRepositoryContractResponse): ViewStreamRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
