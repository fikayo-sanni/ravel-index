export interface MaterializerRegisterAdapterContractRequest {
  tenantId: string;
  materializerRef: string;
  batchRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface MaterializerRegisterAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeMaterializerRegisterAdapterContract(req: MaterializerRegisterAdapterContractRequest): MaterializerRegisterAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeMaterializerRegisterAdapterContract(left: MaterializerRegisterAdapterContractResponse, right: MaterializerRegisterAdapterContractResponse): MaterializerRegisterAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
