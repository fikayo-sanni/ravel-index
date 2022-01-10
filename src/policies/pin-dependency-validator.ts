export interface PinDependencyValidatorInput {
  tenantId: string;
  pinValue: string;
  mergeTag: string;
  minor: bigint;
}

export interface PinDependencyValidatorIssue {
  field: string;
  code: string;
}

export class PinDependencyValidator {
  validate(input: PinDependencyValidatorInput): PinDependencyValidatorIssue[] {
    const issues: PinDependencyValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.pinValue) {
      issues.push({ field: 'pinValue', code: 'REQ' });
    }
    if (input.mergeTag.length > 9) {
      issues.push({ field: 'mergeTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.pinValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'pinValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: PinDependencyValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
