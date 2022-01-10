import { Controller, Get, Param } from '@nestjs/common';
import { RefreshService } from './refresh.service';

@Controller('refresh')
export class RefreshController {
  constructor(private readonly service: RefreshService) {}

  @Get('health')
  health() {
    return { module: 'refresh', ok: true };
  }

  @Get('meta/:tenantId')
  meta(@Param('tenantId') tenantId: string) {
    return { module: 'refresh', tenantId, ts: Date.now() };
  }
}
