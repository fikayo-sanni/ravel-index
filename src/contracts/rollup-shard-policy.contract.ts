export interface RollupShardPolicyContractRequest {
  tenantId: string;
  rollupRef: string;
  cursorRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface RollupShardPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeRollupShardPolicyContract(req: RollupShardPolicyContractRequest): RollupShardPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeRollupShardPolicyContract(left: RollupShardPolicyContractResponse, right: RollupShardPolicyContractResponse): RollupShardPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
