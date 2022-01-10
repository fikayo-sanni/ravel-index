export interface RollupShardValidatorInput {
  tenantId: string;
  rollupValue: string;
  plannerTag: string;
  minor: bigint;
}

export interface RollupShardValidatorIssue {
  field: string;
  code: string;
}

export class RollupShardValidator {
  validate(input: RollupShardValidatorInput): RollupShardValidatorIssue[] {
    const issues: RollupShardValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.rollupValue) {
      issues.push({ field: 'rollupValue', code: 'REQ' });
    }
    if (input.plannerTag.length > 4) {
      issues.push({ field: 'plannerTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.rollupValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'rollupValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: RollupShardValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
