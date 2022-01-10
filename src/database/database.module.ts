import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewEntity } from '../entities/view.entity';
import { DeltaEntity } from '../entities/delta.entity';
import { SnapshotEntity } from '../entities/snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'app',
      password: process.env.DB_PASSWORD ?? 'app',
      database: process.env.DB_NAME ?? 'app',
      entities: [
          ViewEntity,
          DeltaEntity,
          SnapshotEntity
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class DatabaseModule {}
