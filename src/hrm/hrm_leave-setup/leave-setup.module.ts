import { Module } from '@nestjs/common';
import { LeaveSetupService } from './leave-setup.service';
import { LeaveSetupController } from './leave-setup.controller';

@Module({
  providers: [LeaveSetupService],
  controllers: [LeaveSetupController]
})
export class LeaveSetupModule {}
