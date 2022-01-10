export interface GraphMergeCoordinatorContractRequest {
  tenantId: string;
  graphRef: string;
  partitionRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface GraphMergeCoordinatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeGraphMergeCoordinatorContract(req: GraphMergeCoordinatorContractRequest): GraphMergeCoordinatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeGraphMergeCoordinatorContract(left: GraphMergeCoordinatorContractResponse, right: GraphMergeCoordinatorContractResponse): GraphMergeCoordinatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
