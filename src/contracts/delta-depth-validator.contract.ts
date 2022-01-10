export interface DeltaDepthValidatorContractRequest {
  tenantId: string;
  deltaRef: string;
  viewRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DeltaDepthValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDeltaDepthValidatorContract(req: DeltaDepthValidatorContractRequest): DeltaDepthValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDeltaDepthValidatorContract(left: DeltaDepthValidatorContractResponse, right: DeltaDepthValidatorContractResponse): DeltaDepthValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
