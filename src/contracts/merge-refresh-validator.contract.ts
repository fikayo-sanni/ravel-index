export interface MergeRefreshValidatorContractRequest {
  tenantId: string;
  mergeRef: string;
  plannerRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface MergeRefreshValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeMergeRefreshValidatorContract(req: MergeRefreshValidatorContractRequest): MergeRefreshValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeMergeRefreshValidatorContract(left: MergeRefreshValidatorContractResponse, right: MergeRefreshValidatorContractResponse): MergeRefreshValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
