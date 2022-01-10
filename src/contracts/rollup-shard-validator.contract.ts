export interface RollupShardValidatorContractRequest {
  tenantId: string;
  rollupRef: string;
  cursorRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface RollupShardValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeRollupShardValidatorContract(req: RollupShardValidatorContractRequest): RollupShardValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeRollupShardValidatorContract(left: RollupShardValidatorContractResponse, right: RollupShardValidatorContractResponse): RollupShardValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
