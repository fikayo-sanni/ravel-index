export interface Clock {
  nowMs(): number;
}

export class SystemClock implements Clock {
  nowMs(): number {
    return Date.now();
  }
}

export class FrozenClock implements Clock {
  constructor(private readonly fixed: number) {}
  nowMs(): number {
    return this.fixed;
  }
}
