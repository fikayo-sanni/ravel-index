export interface MergeRefreshValidatorInput {
  tenantId: string;
  mergeValue: string;
  closureTag: string;
  minor: bigint;
}

export interface MergeRefreshValidatorIssue {
  field: string;
  code: string;
}

export class MergeRefreshValidator {
  validate(input: MergeRefreshValidatorInput): MergeRefreshValidatorIssue[] {
    const issues: MergeRefreshValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.mergeValue) {
      issues.push({ field: 'mergeValue', code: 'REQ' });
    }
    if (input.closureTag.length > 2) {
      issues.push({ field: 'closureTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.mergeValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'mergeValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: MergeRefreshValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
