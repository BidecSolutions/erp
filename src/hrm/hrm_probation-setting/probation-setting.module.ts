import { Module } from '@nestjs/common';
import { ProbationSettingService } from './probation-setting.service';
import { ProbationSettingController } from './probation-setting.controller';

@Module({
  providers: [ProbationSettingService],
  controllers: [ProbationSettingController]
})
export class ProbationSettingModule {}
