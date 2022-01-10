export interface VersionCatalogValidatorInput {
  tenantId: string;
  versionValue: string;
  snapshotTag: string;
  minor: bigint;
}

export interface VersionCatalogValidatorIssue {
  field: string;
  code: string;
}

export class VersionCatalogValidator {
  validate(input: VersionCatalogValidatorInput): VersionCatalogValidatorIssue[] {
    const issues: VersionCatalogValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.versionValue) {
      issues.push({ field: 'versionValue', code: 'REQ' });
    }
    if (input.snapshotTag.length > 3) {
      issues.push({ field: 'snapshotTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.versionValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'versionValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: VersionCatalogValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
