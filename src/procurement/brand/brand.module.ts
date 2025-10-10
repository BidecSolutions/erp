import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Brand,Company ,Branch ])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
