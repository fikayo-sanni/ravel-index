import { Controller, Get, Param } from '@nestjs/common';
import { DeltaService } from './delta.service';

@Controller('delta')
export class DeltaController {
  constructor(private readonly service: DeltaService) {}

  @Get('health')
  health() {
    return { module: 'delta', ok: true };
  }

  @Get('meta/:tenantId')
  meta(@Param('tenantId') tenantId: string) {
    return { module: 'delta', tenantId, ts: Date.now() };
  }
}
