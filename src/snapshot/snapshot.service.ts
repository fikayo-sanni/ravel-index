import { Injectable } from '@nestjs/common';

@Injectable()
export class SnapshotService {
  pin(latest: number, requested: number) { return requested; }
  isStale(pinned: number, head: number) { return pinned < head; }
}
