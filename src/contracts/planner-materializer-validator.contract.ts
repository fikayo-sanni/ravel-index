export interface PlannerMaterializerValidatorContractRequest {
  tenantId: string;
  plannerRef: string;
  depthRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface PlannerMaterializerValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizePlannerMaterializerValidatorContract(req: PlannerMaterializerValidatorContractRequest): PlannerMaterializerValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergePlannerMaterializerValidatorContract(left: PlannerMaterializerValidatorContractResponse, right: PlannerMaterializerValidatorContractResponse): PlannerMaterializerValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
