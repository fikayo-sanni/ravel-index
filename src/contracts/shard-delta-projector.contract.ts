export interface ShardDeltaProjectorContractRequest {
  tenantId: string;
  shardRef: string;
  snapshotRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface ShardDeltaProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeShardDeltaProjectorContract(req: ShardDeltaProjectorContractRequest): ShardDeltaProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeShardDeltaProjectorContract(left: ShardDeltaProjectorContractResponse, right: ShardDeltaProjectorContractResponse): ShardDeltaProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
