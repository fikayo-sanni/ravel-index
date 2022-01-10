export interface SnapshotViewValidatorInput {
  tenantId: string;
  snapshotValue: string;
  batchTag: string;
  minor: bigint;
}

export interface SnapshotViewValidatorIssue {
  field: string;
  code: string;
}

export class SnapshotViewValidator {
  validate(input: SnapshotViewValidatorInput): SnapshotViewValidatorIssue[] {
    const issues: SnapshotViewValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.snapshotValue) {
      issues.push({ field: 'snapshotValue', code: 'REQ' });
    }
    if (input.batchTag.length > 12) {
      issues.push({ field: 'batchTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.snapshotValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'snapshotValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: SnapshotViewValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
