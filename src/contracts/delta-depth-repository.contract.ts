export interface DeltaDepthRepositoryContractRequest {
  tenantId: string;
  deltaRef: string;
  viewRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DeltaDepthRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDeltaDepthRepositoryContract(req: DeltaDepthRepositoryContractRequest): DeltaDepthRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDeltaDepthRepositoryContract(left: DeltaDepthRepositoryContractResponse, right: DeltaDepthRepositoryContractResponse): DeltaDepthRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
