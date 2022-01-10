export interface StreamVersionValidatorContractRequest {
  tenantId: string;
  streamRef: string;
  mergeRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface StreamVersionValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeStreamVersionValidatorContract(req: StreamVersionValidatorContractRequest): StreamVersionValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeStreamVersionValidatorContract(left: StreamVersionValidatorContractResponse, right: StreamVersionValidatorContractResponse): StreamVersionValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
