export interface PinDependencyAggregatorContractRequest {
  tenantId: string;
  pinRef: string;
  rollupRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface PinDependencyAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizePinDependencyAggregatorContract(req: PinDependencyAggregatorContractRequest): PinDependencyAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergePinDependencyAggregatorContract(left: PinDependencyAggregatorContractResponse, right: PinDependencyAggregatorContractResponse): PinDependencyAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
