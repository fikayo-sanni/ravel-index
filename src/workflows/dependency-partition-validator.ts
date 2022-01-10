export interface DependencyPartitionValidatorInput {
  tenantId: string;
  dependencyValue: string;
  refreshTag: string;
  minor: bigint;
}

export interface DependencyPartitionValidatorIssue {
  field: string;
  code: string;
}

export class DependencyPartitionValidator {
  validate(input: DependencyPartitionValidatorInput): DependencyPartitionValidatorIssue[] {
    const issues: DependencyPartitionValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.dependencyValue) {
      issues.push({ field: 'dependencyValue', code: 'REQ' });
    }
    if (input.refreshTag.length > 20) {
      issues.push({ field: 'refreshTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.dependencyValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'dependencyValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: DependencyPartitionValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
