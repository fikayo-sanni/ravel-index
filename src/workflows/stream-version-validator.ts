export interface StreamVersionValidatorInput {
  tenantId: string;
  streamValue: string;
  cursorTag: string;
  minor: bigint;
}

export interface StreamVersionValidatorIssue {
  field: string;
  code: string;
}

export class StreamVersionValidator {
  validate(input: StreamVersionValidatorInput): StreamVersionValidatorIssue[] {
    const issues: StreamVersionValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.streamValue) {
      issues.push({ field: 'streamValue', code: 'REQ' });
    }
    if (input.cursorTag.length > 7) {
      issues.push({ field: 'cursorTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.streamValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'streamValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: StreamVersionValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
