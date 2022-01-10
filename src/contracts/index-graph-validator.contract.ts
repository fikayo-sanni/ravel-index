export interface IndexGraphValidatorContractRequest {
  tenantId: string;
  indexRef: string;
  dependencyRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface IndexGraphValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeIndexGraphValidatorContract(req: IndexGraphValidatorContractRequest): IndexGraphValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeIndexGraphValidatorContract(left: IndexGraphValidatorContractResponse, right: IndexGraphValidatorContractResponse): IndexGraphValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
