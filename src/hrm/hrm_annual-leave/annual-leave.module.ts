import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnualLeave } from './annual-leave.entity';
import { AnnualLeaveController } from './annual-leave.controller';
import { AnnualLeaveService } from './annual-leave.service';
import { Company } from 'src/Company/companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnnualLeave,Company])],
  controllers: [AnnualLeaveController],
  providers: [AnnualLeaveService],
  exports: [AnnualLeaveService] 
})
export class AnnualLeaveModule {}
