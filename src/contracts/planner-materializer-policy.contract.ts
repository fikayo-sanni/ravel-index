export interface PlannerMaterializerPolicyContractRequest {
  tenantId: string;
  plannerRef: string;
  depthRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface PlannerMaterializerPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizePlannerMaterializerPolicyContract(req: PlannerMaterializerPolicyContractRequest): PlannerMaterializerPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergePlannerMaterializerPolicyContract(left: PlannerMaterializerPolicyContractResponse, right: PlannerMaterializerPolicyContractResponse): PlannerMaterializerPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
