export interface GraphMergeAggregatorContractRequest {
  tenantId: string;
  graphRef: string;
  partitionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface GraphMergeAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeGraphMergeAggregatorContract(req: GraphMergeAggregatorContractRequest): GraphMergeAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeGraphMergeAggregatorContract(left: GraphMergeAggregatorContractResponse, right: GraphMergeAggregatorContractResponse): GraphMergeAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
