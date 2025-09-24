import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allowance } from './allowance.entity';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';
import { AllowanceOption } from '../hrm_allowance-option/allowance-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Allowance, AllowanceOption])],
  controllers: [AllowanceController],
  providers: [AllowanceService],
})
export class AllowanceModule {}
