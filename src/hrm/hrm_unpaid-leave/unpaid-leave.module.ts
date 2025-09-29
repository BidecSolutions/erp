import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnpaidLeave } from './unpaid-leave.entity';
import { UnpaidLeaveService } from './unpaid-leave.service';
import { UnpaidLeaveController } from './unpaid-leave.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnpaidLeave])],
  providers: [UnpaidLeaveService],
  controllers: [UnpaidLeaveController],
})
export class UnpaidLeaveModule {}
