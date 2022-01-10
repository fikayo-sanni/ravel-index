export interface MaterializerRegisterPolicyContractRequest {
  tenantId: string;
  materializerRef: string;
  batchRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface MaterializerRegisterPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeMaterializerRegisterPolicyContract(req: MaterializerRegisterPolicyContractRequest): MaterializerRegisterPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeMaterializerRegisterPolicyContract(left: MaterializerRegisterPolicyContractResponse, right: MaterializerRegisterPolicyContractResponse): MaterializerRegisterPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
