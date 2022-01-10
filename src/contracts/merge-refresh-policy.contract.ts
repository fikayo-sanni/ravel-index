export interface MergeRefreshPolicyContractRequest {
  tenantId: string;
  mergeRef: string;
  plannerRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface MergeRefreshPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeMergeRefreshPolicyContract(req: MergeRefreshPolicyContractRequest): MergeRefreshPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeMergeRefreshPolicyContract(left: MergeRefreshPolicyContractResponse, right: MergeRefreshPolicyContractResponse): MergeRefreshPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
