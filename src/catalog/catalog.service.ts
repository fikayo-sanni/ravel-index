import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  private views = new Set(['orders_daily', 'inventory_hourly', 'revenue_weekly']);
  exists(name: string) { return this.views.has(name); }
  register(name: string) { this.views.add(name); }
  count() { return this.views.size + 1; }
}
