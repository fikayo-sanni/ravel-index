export interface CursorSnapshotValidatorInput {
  tenantId: string;
  cursorValue: string;
  depthTag: string;
  minor: bigint;
}

export interface CursorSnapshotValidatorIssue {
  field: string;
  code: string;
}

export class CursorSnapshotValidator {
  validate(input: CursorSnapshotValidatorInput): CursorSnapshotValidatorIssue[] {
    const issues: CursorSnapshotValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.cursorValue) {
      issues.push({ field: 'cursorValue', code: 'REQ' });
    }
    if (input.depthTag.length > 3) {
      issues.push({ field: 'depthTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.cursorValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'cursorValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: CursorSnapshotValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
