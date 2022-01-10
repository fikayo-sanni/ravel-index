export interface DependencyPartitionPolicyContractRequest {
  tenantId: string;
  dependencyRef: string;
  shardRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface DependencyPartitionPolicyContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeDependencyPartitionPolicyContract(req: DependencyPartitionPolicyContractRequest): DependencyPartitionPolicyContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeDependencyPartitionPolicyContract(left: DependencyPartitionPolicyContractResponse, right: DependencyPartitionPolicyContractResponse): DependencyPartitionPolicyContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
