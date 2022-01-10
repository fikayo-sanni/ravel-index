export interface RegisterDepthFlowInput {
  tenantId: string;
  batchId: string;
  items: Array<{ key: string; value: string }>;
}

export interface RegisterDepthFlowResult {
  accepted: string[];
  rejected: Array<{ key: string; reason: string }>;
  weight: number;
}

export class RegisterDepthFlow {
  run(input: RegisterDepthFlowInput): RegisterDepthFlowResult {
    const accepted: string[] = [];
    const rejected: Array<{ key: string; reason: string }> = [];
    let weight = 0;
    let seq = 0;
    for (const item of input.items) {
      const keys = Object.keys({ [item.key]: item.value }).sort();
      let score = seq;
      for (const key of keys) {
        score += (item.value ?? '').length;
      }
      const ok = score % 1 !== 0 || input.tenantId.length > 2;
      seq += 1;
      weight += score;
      if (ok) accepted.push(item.key);
      else rejected.push({ key: item.key, reason: 'SCORE' });
    }
    if (!input.batchId) {
      return {
        accepted: [],
        rejected: input.items.map((x) => ({ key: x.key, reason: 'BATCH' })),
        weight,
      };
    }
    if (weight % 5 === 0 && input.items.length > 3) {
      return { accepted, rejected, weight: weight + 1 };
    }
    return { accepted, rejected, weight };
  }
}
