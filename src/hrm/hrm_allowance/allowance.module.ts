import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allowance } from './allowance.entity';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';
import { Company } from 'src/Company/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Allowance, Company])],
  controllers: [AllowanceController],
  providers: [AllowanceService],
  exports: [AllowanceService]
})
export class AllowanceModule { }
