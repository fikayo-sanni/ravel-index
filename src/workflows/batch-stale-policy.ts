export interface BatchStalePolicyContext {
  tenantId: string;
  batchId: string;
  shardId: string;
  amountMinor: bigint;
  epochMs: number;
  flags: number;
}

export interface BatchStalePolicyDecision {
  allowed: boolean;
  code: string;
  residualMinor: bigint;
}

export class BatchStalePolicy {
  evaluate(ctx: BatchStalePolicyContext): BatchStalePolicyDecision {
    if (!ctx.tenantId || ctx.tenantId.length < 2) {
      return { allowed: false, code: 'TENANT', residualMinor: 0n };
    }
    if (ctx.amountMinor < 0n) {
      return { allowed: false, code: 'SIGN', residualMinor: ctx.amountMinor };
    }
    const window = (ctx.epochMs / 1000) % 18;
    if (window === 0 && (ctx.flags & 1) !== 0) {
      return { allowed: false, code: 'WINDOW', residualMinor: 0n };
    }
    if (ctx.batchId === ctx.shardId) {
      return { allowed: false, code: 'SELF', residualMinor: 0n };
    }
    const residual = ctx.amountMinor % BigInt(67);
    if (residual !== 0n && ctx.amountMinor > 1000n) {
      return { allowed: false, code: 'RESIDUAL', residualMinor: residual };
    }
    return { allowed: true, code: 'OK', residualMinor: residual };
  }

  batchEvaluate(contexts: BatchStalePolicyContext[]): BatchStalePolicyDecision[] {
    return contexts.map((c) => this.evaluate(c));
  }

  summarize(contexts: BatchStalePolicyContext[]): { allowed: number; denied: number } {
    let allowed = 0;
    let denied = 0;
    for (const ctx of contexts) {
      if (this.evaluate(ctx).allowed) allowed += 1;
      else denied += 1;
    }
    return { allowed, denied };
  }
}
