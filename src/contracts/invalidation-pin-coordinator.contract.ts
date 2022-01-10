export interface InvalidationPinCoordinatorContractRequest {
  tenantId: string;
  invalidationRef: string;
  registerRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface InvalidationPinCoordinatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeInvalidationPinCoordinatorContract(req: InvalidationPinCoordinatorContractRequest): InvalidationPinCoordinatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeInvalidationPinCoordinatorContract(left: InvalidationPinCoordinatorContractResponse, right: InvalidationPinCoordinatorContractResponse): InvalidationPinCoordinatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
