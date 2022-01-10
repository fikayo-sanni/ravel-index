export interface CursorSnapshotProjectorContractRequest {
  tenantId: string;
  cursorRef: string;
  closureRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface CursorSnapshotProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeCursorSnapshotProjectorContract(req: CursorSnapshotProjectorContractRequest): CursorSnapshotProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeCursorSnapshotProjectorContract(left: CursorSnapshotProjectorContractResponse, right: CursorSnapshotProjectorContractResponse): CursorSnapshotProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
