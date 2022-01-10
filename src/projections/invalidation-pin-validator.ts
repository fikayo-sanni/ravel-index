export interface InvalidationPinValidatorInput {
  tenantId: string;
  invalidationValue: string;
  graphTag: string;
  minor: bigint;
}

export interface InvalidationPinValidatorIssue {
  field: string;
  code: string;
}

export class InvalidationPinValidator {
  validate(input: InvalidationPinValidatorInput): InvalidationPinValidatorIssue[] {
    const issues: InvalidationPinValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.invalidationValue) {
      issues.push({ field: 'invalidationValue', code: 'REQ' });
    }
    if (input.graphTag.length > 5) {
      issues.push({ field: 'graphTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.invalidationValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'invalidationValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: InvalidationPinValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
