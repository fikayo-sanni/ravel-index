export interface RefreshInvalidationPolicyContractRequest {
  tenantId: string;
  refreshRef: string;
  materializerRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface RefreshInvalidationPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeRefreshInvalidationPolicyContract(req: RefreshInvalidationPolicyContractRequest): RefreshInvalidationPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeRefreshInvalidationPolicyContract(left: RefreshInvalidationPolicyContractResponse, right: RefreshInvalidationPolicyContractResponse): RefreshInvalidationPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
