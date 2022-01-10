export interface GraphMergeProjectorContractRequest {
  tenantId: string;
  graphRef: string;
  partitionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface GraphMergeProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeGraphMergeProjectorContract(req: GraphMergeProjectorContractRequest): GraphMergeProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeGraphMergeProjectorContract(left: GraphMergeProjectorContractResponse, right: GraphMergeProjectorContractResponse): GraphMergeProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
