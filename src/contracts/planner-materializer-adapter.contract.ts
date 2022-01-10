export interface PlannerMaterializerAdapterContractRequest {
  tenantId: string;
  plannerRef: string;
  depthRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface PlannerMaterializerAdapterContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizePlannerMaterializerAdapterContract(req: PlannerMaterializerAdapterContractRequest): PlannerMaterializerAdapterContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergePlannerMaterializerAdapterContract(left: PlannerMaterializerAdapterContractResponse, right: PlannerMaterializerAdapterContractResponse): PlannerMaterializerAdapterContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
