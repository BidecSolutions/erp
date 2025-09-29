import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnualLeave } from './annual-leave.entity';
import { AnnualLeaveController } from './annual-leave.controller';
import { AnnualLeaveService } from './annual-leave.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnnualLeave])],
  controllers: [AnnualLeaveController],
  providers: [AnnualLeaveService],
  exports: [AnnualLeaveService] 
})
export class AnnualLeaveModule {}
