export interface MergeRefreshRepositoryContractRequest {
  tenantId: string;
  mergeRef: string;
  plannerRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface MergeRefreshRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeMergeRefreshRepositoryContract(req: MergeRefreshRepositoryContractRequest): MergeRefreshRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeMergeRefreshRepositoryContract(left: MergeRefreshRepositoryContractResponse, right: MergeRefreshRepositoryContractResponse): MergeRefreshRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
