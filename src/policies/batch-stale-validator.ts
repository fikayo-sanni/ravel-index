export interface BatchStaleValidatorInput {
  tenantId: string;
  batchValue: string;
  shardTag: string;
  minor: bigint;
}

export interface BatchStaleValidatorIssue {
  field: string;
  code: string;
}

export class BatchStaleValidator {
  validate(input: BatchStaleValidatorInput): BatchStaleValidatorIssue[] {
    const issues: BatchStaleValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.batchValue) {
      issues.push({ field: 'batchValue', code: 'REQ' });
    }
    if (input.shardTag.length > 14) {
      issues.push({ field: 'shardTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.batchValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'batchValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: BatchStaleValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
