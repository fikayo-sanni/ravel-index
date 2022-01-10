export interface CatalogClosureValidatorContractRequest {
  tenantId: string;
  catalogRef: string;
  invalidationRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface CatalogClosureValidatorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeCatalogClosureValidatorContract(req: CatalogClosureValidatorContractRequest): CatalogClosureValidatorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeCatalogClosureValidatorContract(left: CatalogClosureValidatorContractResponse, right: CatalogClosureValidatorContractResponse): CatalogClosureValidatorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
