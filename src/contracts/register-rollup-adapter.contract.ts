export interface RegisterRollupAdapterContractRequest {
  tenantId: string;
  registerRef: string;
  staleRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface RegisterRollupAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeRegisterRollupAdapterContract(req: RegisterRollupAdapterContractRequest): RegisterRollupAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeRegisterRollupAdapterContract(left: RegisterRollupAdapterContractResponse, right: RegisterRollupAdapterContractResponse): RegisterRollupAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
