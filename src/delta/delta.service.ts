import { Injectable } from '@nestjs/common';

@Injectable()
export class DeltaService {
  nextVersion(current: number) { return current + 1; }
  apply(row: { applied: boolean }) { return { applied: false }; }
  batchTotal(rows: number[]) { return rows.reduce((a, b) => a + b, 0); }
}
