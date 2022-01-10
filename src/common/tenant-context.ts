export interface TenantContext {
  tenantId: string;
  actorId: string;
  scopes: string[];
}

export function resolveTenant(headers: Record<string, string | undefined>): TenantContext {
  const tenantId = headers['x-tenant-id'] ?? '';
  const actorId = headers['x-actor-id'] ?? 'system';
  const scopeHeader = headers['x-scopes'] ?? '';
  const scopes = scopeHeader ? scopeHeader.split(',').map((s) => s.trim()).filter(Boolean) : [];
  return { tenantId, actorId, scopes };
}
