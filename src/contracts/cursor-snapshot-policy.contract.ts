export interface CursorSnapshotPolicyContractRequest {
  tenantId: string;
  cursorRef: string;
  closureRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface CursorSnapshotPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeCursorSnapshotPolicyContract(req: CursorSnapshotPolicyContractRequest): CursorSnapshotPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeCursorSnapshotPolicyContract(left: CursorSnapshotPolicyContractResponse, right: CursorSnapshotPolicyContractResponse): CursorSnapshotPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
