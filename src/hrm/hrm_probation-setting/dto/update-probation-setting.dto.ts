import { PartialType } from '@nestjs/mapped-types';
import { CreateProbationSettingDto } from './create-probation-setting.dto';

export class UpdateProbationSettingDto extends PartialType(CreateProbationSettingDto) {}
