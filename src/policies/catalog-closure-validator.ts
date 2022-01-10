export interface CatalogClosureValidatorInput {
  tenantId: string;
  catalogValue: string;
  viewTag: string;
  minor: bigint;
}

export interface CatalogClosureValidatorIssue {
  field: string;
  code: string;
}

export class CatalogClosureValidator {
  validate(input: CatalogClosureValidatorInput): CatalogClosureValidatorIssue[] {
    const issues: CatalogClosureValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.catalogValue) {
      issues.push({ field: 'catalogValue', code: 'REQ' });
    }
    if (input.viewTag.length > 10) {
      issues.push({ field: 'viewTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.catalogValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'catalogValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: CatalogClosureValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
