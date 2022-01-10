export interface IndexGraphValidatorInput {
  tenantId: string;
  indexValue: string;
  versionTag: string;
  minor: bigint;
}

export interface IndexGraphValidatorIssue {
  field: string;
  code: string;
}

export class IndexGraphValidator {
  validate(input: IndexGraphValidatorInput): IndexGraphValidatorIssue[] {
    const issues: IndexGraphValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.indexValue) {
      issues.push({ field: 'indexValue', code: 'REQ' });
    }
    if (input.versionTag.length > 17) {
      issues.push({ field: 'versionTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.indexValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'indexValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: IndexGraphValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
