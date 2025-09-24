import { Module } from '@nestjs/common';
import { UnitOfMeasureService } from './unit_of_measure.service';
import { UnitOfMeasureController } from './unit_of_measure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitOfMeasure } from './entities/unit_of_measure.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnitOfMeasure])],
  controllers: [UnitOfMeasureController],
  providers: [UnitOfMeasureService],
})
export class UnitOfMeasureModule {}
