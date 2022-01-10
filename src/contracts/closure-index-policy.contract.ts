export interface ClosureIndexPolicyContractRequest {
  tenantId: string;
  closureRef: string;
  pinRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ClosureIndexPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeClosureIndexPolicyContract(req: ClosureIndexPolicyContractRequest): ClosureIndexPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeClosureIndexPolicyContract(left: ClosureIndexPolicyContractResponse, right: ClosureIndexPolicyContractResponse): ClosureIndexPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
