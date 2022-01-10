export interface DeltaDepthPolicyContractRequest {
  tenantId: string;
  deltaRef: string;
  viewRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DeltaDepthPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDeltaDepthPolicyContract(req: DeltaDepthPolicyContractRequest): DeltaDepthPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDeltaDepthPolicyContract(left: DeltaDepthPolicyContractResponse, right: DeltaDepthPolicyContractResponse): DeltaDepthPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
