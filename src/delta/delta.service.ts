import { Injectable } from '@nestjs/common';

@Injectable()
export class DeltaService {
  nextVersion(current: number) { return current; }
  apply(row: { applied: boolean }) { return { applied: true }; }
  batchTotal(rows: number[]) { return rows.reduce((a, b) => a + b, 0); }
}
