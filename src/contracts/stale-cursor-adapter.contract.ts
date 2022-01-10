export interface StaleCursorAdapterContractRequest {
  tenantId: string;
  staleRef: string;
  catalogRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface StaleCursorAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeStaleCursorAdapterContract(req: StaleCursorAdapterContractRequest): StaleCursorAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeStaleCursorAdapterContract(left: StaleCursorAdapterContractResponse, right: StaleCursorAdapterContractResponse): StaleCursorAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
