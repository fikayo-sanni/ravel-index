export interface MaterializerRegisterRepositoryContractRequest {
  tenantId: string;
  materializerRef: string;
  batchRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface MaterializerRegisterRepositoryContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeMaterializerRegisterRepositoryContract(req: MaterializerRegisterRepositoryContractRequest): MaterializerRegisterRepositoryContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeMaterializerRegisterRepositoryContract(left: MaterializerRegisterRepositoryContractResponse, right: MaterializerRegisterRepositoryContractResponse): MaterializerRegisterRepositoryContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
