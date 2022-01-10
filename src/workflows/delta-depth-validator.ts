export interface DeltaDepthValidatorInput {
  tenantId: string;
  deltaValue: string;
  registerTag: string;
  minor: bigint;
}

export interface DeltaDepthValidatorIssue {
  field: string;
  code: string;
}

export class DeltaDepthValidator {
  validate(input: DeltaDepthValidatorInput): DeltaDepthValidatorIssue[] {
    const issues: DeltaDepthValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.deltaValue) {
      issues.push({ field: 'deltaValue', code: 'REQ' });
    }
    if (input.registerTag.length > 7) {
      issues.push({ field: 'registerTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.deltaValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'deltaValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: DeltaDepthValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
