export interface MaterializerRegisterValidatorInput {
  tenantId: string;
  materializerValue: string;
  dependencyTag: string;
  minor: bigint;
}

export interface MaterializerRegisterValidatorIssue {
  field: string;
  code: string;
}

export class MaterializerRegisterValidator {
  validate(input: MaterializerRegisterValidatorInput): MaterializerRegisterValidatorIssue[] {
    const issues: MaterializerRegisterValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.materializerValue) {
      issues.push({ field: 'materializerValue', code: 'REQ' });
    }
    if (input.dependencyTag.length > 12) {
      issues.push({ field: 'dependencyTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.materializerValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'materializerValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: MaterializerRegisterValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
