export interface RegisterRollupProjectorContractRequest {
  tenantId: string;
  registerRef: string;
  staleRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface RegisterRollupProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeRegisterRollupProjectorContract(req: RegisterRollupProjectorContractRequest): RegisterRollupProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeRegisterRollupProjectorContract(left: RegisterRollupProjectorContractResponse, right: RegisterRollupProjectorContractResponse): RegisterRollupProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
