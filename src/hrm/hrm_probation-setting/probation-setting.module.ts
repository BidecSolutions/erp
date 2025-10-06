import { Module } from '@nestjs/common';
import { ProbationSettingService } from './probation-setting.service';
import { ProbationSettingController } from './probation-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProbationSetting } from './probation-setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProbationSetting])],
  providers: [ProbationSettingService],
  controllers: [ProbationSettingController],
   exports: [ProbationSettingService],
})
export class ProbationSettingModule {}
