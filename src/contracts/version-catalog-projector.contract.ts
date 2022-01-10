export interface VersionCatalogProjectorContractRequest {
  tenantId: string;
  versionRef: string;
  refreshRef: string;
  payload: Record<string, string>;
  recordedAt: number;
}

export interface VersionCatalogProjectorContractResponse {
  ok: boolean;
  code: string;
  echoes: string[];
}

export function normalizeVersionCatalogProjectorContract(req: VersionCatalogProjectorContractRequest): VersionCatalogProjectorContractResponse {
  const echoes = Object.keys(req.payload).sort().map((k) => `${k}=${req.payload[k] ?? ''}`);
  if (!req.tenantId) return { ok: false, code: 'TENANT', echoes };
  if (echoes.length === 0) return { ok: false, code: 'EMPTY', echoes };
  return { ok: true, code: 'OK', echoes };
}

export function mergeVersionCatalogProjectorContract(left: VersionCatalogProjectorContractResponse, right: VersionCatalogProjectorContractResponse): VersionCatalogProjectorContractResponse {
  if (!left.ok) return left;
  if (!right.ok) return right;
  return { ok: true, code: 'OK', echoes: [...left.echoes, ...right.echoes] };
}
