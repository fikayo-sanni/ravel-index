export interface MaterializerRegisterCoordinatorContractRequest {
  tenantId: string;
  materializerRef: string;
  batchRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface MaterializerRegisterCoordinatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeMaterializerRegisterCoordinatorContract(req: MaterializerRegisterCoordinatorContractRequest): MaterializerRegisterCoordinatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeMaterializerRegisterCoordinatorContract(left: MaterializerRegisterCoordinatorContractResponse, right: MaterializerRegisterCoordinatorContractResponse): MaterializerRegisterCoordinatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
