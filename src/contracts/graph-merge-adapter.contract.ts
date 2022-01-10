export interface GraphMergeAdapterContractRequest {
  tenantId: string;
  graphRef: string;
  partitionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface GraphMergeAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeGraphMergeAdapterContract(req: GraphMergeAdapterContractRequest): GraphMergeAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeGraphMergeAdapterContract(left: GraphMergeAdapterContractResponse, right: GraphMergeAdapterContractResponse): GraphMergeAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
