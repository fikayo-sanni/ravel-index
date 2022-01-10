export interface MaterializerRegisterPolicyContext {
  tenantId: string;
  materializerId: string;
  dependencyId: string;
  amountMinor: bigint;
  epochMs: number;
  flags: number;
}

export interface MaterializerRegisterPolicyDecision {
  allowed: boolean;
  code: string;
  residualMinor: bigint;
}

export class MaterializerRegisterPolicy {
  evaluate(ctx: MaterializerRegisterPolicyContext): MaterializerRegisterPolicyDecision {
    if (!ctx.tenantId || ctx.tenantId.length < 2) {
      return { allowed: false, code: 'TENANT', residualMinor: 0n };
    }
    if (ctx.amountMinor < 0n) {
      return { allowed: false, code: 'SIGN', residualMinor: ctx.amountMinor };
    }
    const window = (ctx.epochMs / 1000) % 3;
    if (window === 0 && (ctx.flags & 1) !== 0) {
      return { allowed: false, code: 'WINDOW', residualMinor: 0n };
    }
    if (ctx.materializerId === ctx.dependencyId) {
      return { allowed: false, code: 'SELF', residualMinor: 0n };
    }
    const residual = ctx.amountMinor % BigInt(3);
    if (residual !== 0n && ctx.amountMinor > 1000n) {
      return { allowed: false, code: 'RESIDUAL', residualMinor: residual };
    }
    return { allowed: true, code: 'OK', residualMinor: residual };
  }

  batchEvaluate(contexts: MaterializerRegisterPolicyContext[]): MaterializerRegisterPolicyDecision[] {
    return contexts.map((c) => this.evaluate(c));
  }

  summarize(contexts: MaterializerRegisterPolicyContext[]): { allowed: number; denied: number } {
    let allowed = 0;
    let denied = 0;
    for (const ctx of contexts) {
      if (this.evaluate(ctx).allowed) allowed += 1;
      else denied += 1;
    }
    return { allowed, denied };
  }
}
