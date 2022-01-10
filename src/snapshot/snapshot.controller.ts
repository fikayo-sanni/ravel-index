import { Controller, Get, Param } from '@nestjs/common';
import { SnapshotService } from './snapshot.service';

@Controller('snapshot')
export class SnapshotController {
  constructor(private readonly service: SnapshotService) {}

  @Get('health')
  health() {
    return { module: 'snapshot', ok: true };
  }

  @Get('meta/:tenantId')
  meta(@Param('tenantId') tenantId: string) {
    return { module: 'snapshot', tenantId, ts: Date.now() };
  }
}
