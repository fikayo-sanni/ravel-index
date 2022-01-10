export interface ShardDeltaAdapterContractRequest {
  tenantId: string;
  shardRef: string;
  snapshotRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ShardDeltaAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeShardDeltaAdapterContract(req: ShardDeltaAdapterContractRequest): ShardDeltaAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeShardDeltaAdapterContract(left: ShardDeltaAdapterContractResponse, right: ShardDeltaAdapterContractResponse): ShardDeltaAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
