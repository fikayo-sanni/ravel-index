export interface ViewStreamValidatorInput {
  tenantId: string;
  viewValue: string;
  staleTag: string;
  minor: bigint;
}

export interface ViewStreamValidatorIssue {
  field: string;
  code: string;
}

export class ViewStreamValidator {
  validate(input: ViewStreamValidatorInput): ViewStreamValidatorIssue[] {
    const issues: ViewStreamValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.viewValue) {
      issues.push({ field: 'viewValue', code: 'REQ' });
    }
    if (input.staleTag.length > 14) {
      issues.push({ field: 'staleTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.viewValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'viewValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: ViewStreamValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
