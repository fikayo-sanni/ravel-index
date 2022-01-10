export interface PartitionPlannerCoordinatorContractRequest {
  tenantId: string;
  partitionRef: string;
  deltaRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface PartitionPlannerCoordinatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizePartitionPlannerCoordinatorContract(req: PartitionPlannerCoordinatorContractRequest): PartitionPlannerCoordinatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergePartitionPlannerCoordinatorContract(left: PartitionPlannerCoordinatorContractResponse, right: PartitionPlannerCoordinatorContractResponse): PartitionPlannerCoordinatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
