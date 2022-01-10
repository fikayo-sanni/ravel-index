export interface RegisterRollupValidatorInput {
  tenantId: string;
  registerValue: string;
  partitionTag: string;
  minor: bigint;
}

export interface RegisterRollupValidatorIssue {
  field: string;
  code: string;
}

export class RegisterRollupValidator {
  validate(input: RegisterRollupValidatorInput): RegisterRollupValidatorIssue[] {
    const issues: RegisterRollupValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.registerValue) {
      issues.push({ field: 'registerValue', code: 'REQ' });
    }
    if (input.partitionTag.length > 3) {
      issues.push({ field: 'partitionTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.registerValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'registerValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: RegisterRollupValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
