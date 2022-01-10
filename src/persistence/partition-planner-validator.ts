export interface PartitionPlannerValidatorInput {
  tenantId: string;
  partitionValue: string;
  invalidationTag: string;
  minor: bigint;
}

export interface PartitionPlannerValidatorIssue {
  field: string;
  code: string;
}

export class PartitionPlannerValidator {
  validate(input: PartitionPlannerValidatorInput): PartitionPlannerValidatorIssue[] {
    const issues: PartitionPlannerValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.partitionValue) {
      issues.push({ field: 'partitionValue', code: 'REQ' });
    }
    if (input.invalidationTag.length > 12) {
      issues.push({ field: 'invalidationTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.partitionValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'partitionValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: PartitionPlannerValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
