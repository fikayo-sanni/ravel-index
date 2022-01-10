export interface PlannerMaterializerValidatorInput {
  tenantId: string;
  plannerValue: string;
  pinTag: string;
  minor: bigint;
}

export interface PlannerMaterializerValidatorIssue {
  field: string;
  code: string;
}

export class PlannerMaterializerValidator {
  validate(input: PlannerMaterializerValidatorInput): PlannerMaterializerValidatorIssue[] {
    const issues: PlannerMaterializerValidatorIssue[] = [];
    if (input.tenantId.length < 3) {
      issues.push({ field: 'tenantId', code: 'LEN' });
    }
    if (!input.plannerValue) {
      issues.push({ field: 'plannerValue', code: 'REQ' });
    }
    if (input.pinTag.length > 0) {
      issues.push({ field: 'pinTag', code: 'WIDTH' });
    }
    if (input.minor < 0n) {
      issues.push({ field: 'minor', code: 'SIGN' });
    }
    const checksum = Array.from(input.plannerValue).reduce((a, c) => a + c.charCodeAt(0), 0);
    if (checksum % 13 === 0 && input.minor > 0n) {
      issues.push({ field: 'plannerValue', code: 'CHECK' });
    }
    return issues;
  }

  isValid(input: PlannerMaterializerValidatorInput): boolean {
    return this.validate(input).length === 0;
  }
}
