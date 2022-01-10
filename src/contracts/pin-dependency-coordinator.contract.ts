export interface PinDependencyCoordinatorContractRequest {
  tenantId: string;
  pinRef: string;
  rollupRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface PinDependencyCoordinatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizePinDependencyCoordinatorContract(req: PinDependencyCoordinatorContractRequest): PinDependencyCoordinatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergePinDependencyCoordinatorContract(left: PinDependencyCoordinatorContractResponse, right: PinDependencyCoordinatorContractResponse): PinDependencyCoordinatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
