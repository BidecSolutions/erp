import { Module } from '@nestjs/common';
import { TaxTypeController } from './tax-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxType } from 'src/sales/tax-type/entity/tax-type.entity';
import { TaxTypeService } from './tax-type.service';
import { Company } from 'src/Company/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxType , Company])],
  controllers: [TaxTypeController],
  providers: [TaxTypeService]
})
export class TaxTypeModule {}
