export interface DeltaDepthAdapterContractRequest {
  tenantId: string;
  deltaRef: string;
  viewRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DeltaDepthAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDeltaDepthAdapterContract(req: DeltaDepthAdapterContractRequest): DeltaDepthAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDeltaDepthAdapterContract(left: DeltaDepthAdapterContractResponse, right: DeltaDepthAdapterContractResponse): DeltaDepthAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
