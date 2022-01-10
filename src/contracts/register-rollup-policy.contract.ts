export interface RegisterRollupPolicyContractRequest {
  tenantId: string;
  registerRef: string;
  staleRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface RegisterRollupPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeRegisterRollupPolicyContract(req: RegisterRollupPolicyContractRequest): RegisterRollupPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeRegisterRollupPolicyContract(left: RegisterRollupPolicyContractResponse, right: RegisterRollupPolicyContractResponse): RegisterRollupPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
