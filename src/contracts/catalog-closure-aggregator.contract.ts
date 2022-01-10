export interface CatalogClosureAggregatorContractRequest {
  tenantId: string;
  catalogRef: string;
  invalidationRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface CatalogClosureAggregatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeCatalogClosureAggregatorContract(req: CatalogClosureAggregatorContractRequest): CatalogClosureAggregatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeCatalogClosureAggregatorContract(left: CatalogClosureAggregatorContractResponse, right: CatalogClosureAggregatorContractResponse): CatalogClosureAggregatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
