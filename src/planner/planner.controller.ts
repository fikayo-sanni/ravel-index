import { Controller, Get, Param } from '@nestjs/common';
import { PlannerService } from './planner.service';

@Controller('planner')
export class PlannerController {
  constructor(private readonly service: PlannerService) {}

  @Get('health')
  health() {
    return { module: 'planner', ok: true };
  }

  @Get('meta/:tenantId')
  meta(@Param('tenantId') tenantId: string) {
    return { module: 'planner', tenantId, ts: Date.now() };
  }
}
