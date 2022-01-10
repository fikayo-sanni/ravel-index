import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './catalog/catalog.module';
import { RefreshModule } from './refresh/refresh.module';
import { DeltaModule } from './delta/delta.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { PlannerModule } from './planner/planner.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    CatalogModule,
    RefreshModule,
    DeltaModule,
    SnapshotModule,
    PlannerModule,
  ],
})
export class AppModule {}
