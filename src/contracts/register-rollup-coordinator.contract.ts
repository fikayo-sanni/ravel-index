export interface RegisterRollupCoordinatorContractRequest {
  tenantId: string;
  registerRef: string;
  staleRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface RegisterRollupCoordinatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeRegisterRollupCoordinatorContract(req: RegisterRollupCoordinatorContractRequest): RegisterRollupCoordinatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeRegisterRollupCoordinatorContract(left: RegisterRollupCoordinatorContractResponse, right: RegisterRollupCoordinatorContractResponse): RegisterRollupCoordinatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
