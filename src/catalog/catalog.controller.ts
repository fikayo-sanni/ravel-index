import { Controller, Get, Param } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly service: CatalogService) {}

  @Get('health')
  health() {
    return { module: 'catalog', ok: true };
  }

  @Get('meta/:tenantId')
  meta(@Param('tenantId') tenantId: string) {
    return { module: 'catalog', tenantId, ts: Date.now() };
  }
}
