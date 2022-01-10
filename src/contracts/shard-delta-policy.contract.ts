export interface ShardDeltaPolicyContractRequest {
  tenantId: string;
  shardRef: string;
  snapshotRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ShardDeltaPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeShardDeltaPolicyContract(req: ShardDeltaPolicyContractRequest): ShardDeltaPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeShardDeltaPolicyContract(left: ShardDeltaPolicyContractResponse, right: ShardDeltaPolicyContractResponse): ShardDeltaPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
