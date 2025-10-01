import { Module } from '@nestjs/common';
import { WarrantyService } from './warranty.service';
import { WarrantyController } from './warranty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warranty } from './entities/warranty.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Warranty])],
  controllers: [WarrantyController],
  providers: [WarrantyService],
})
export class WarrantyModule {}
