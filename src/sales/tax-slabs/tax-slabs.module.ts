import { Module } from '@nestjs/common';
import { TaxSlabsController } from './tax-slabs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxSlab } from './entity/tax-slabs.entity';
import { TaxType } from '../tax-type/entity/tax-type.entity';
import { TaxSlabService } from './tax-slabs.service';

@Module({
  imports:[TypeOrmModule.forFeature([TaxSlab,TaxType ])],
  controllers: [TaxSlabsController],
  providers:[TaxSlabService]
})
export class TaxSlabsModule {}
