import { Module } from '@nestjs/common';
import { DeltaService } from './delta.service';
import { DeltaController } from './delta.controller';
@Module({
  controllers: [DeltaController],
  providers: [DeltaService],
  exports: [DeltaService],
})
export class DeltaModule {}
