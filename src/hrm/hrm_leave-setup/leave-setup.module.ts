import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveSetup } from './leave-setup.entity';
import { LeaveSetupService } from './leave-setup.service';
import { LeaveSetupController } from './leave-setup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveSetup])],
  controllers: [LeaveSetupController],
  providers: [LeaveSetupService],
  exports: [LeaveSetupService] 
})
export class LeaveSetupModule {}
