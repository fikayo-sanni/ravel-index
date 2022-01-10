export interface ClosureIndexValidatorInput {
  tenantId: string;
  closureValue: string;
  streamTag: string;
  minor: bigint;
}

export interface ClosureIndexValidatorIssue {
  field: string;
  code: string;
}

export class ClosureIndexValidator {
  validate(input: ClosureIndexValidatorInput): ClosureIndexValidatorIssue[] {
    const issues: ClosureIndexValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.closureValue) {
      issues.push({ field: 'closureValue', code: 'REQ' });
    }
    if (input.streamTag.length > 8) {
      issues.push({ field: 'streamTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.closureValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'closureValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: ClosureIndexValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
