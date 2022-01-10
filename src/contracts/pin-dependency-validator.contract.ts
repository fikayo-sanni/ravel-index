export interface PinDependencyValidatorContractRequest {
  tenantId: string;
  pinRef: string;
  rollupRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface PinDependencyValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizePinDependencyValidatorContract(req: PinDependencyValidatorContractRequest): PinDependencyValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergePinDependencyValidatorContract(left: PinDependencyValidatorContractResponse, right: PinDependencyValidatorContractResponse): PinDependencyValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
