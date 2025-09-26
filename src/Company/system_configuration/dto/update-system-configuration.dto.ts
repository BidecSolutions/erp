import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemConfigurationDto } from './create-system-configuration.dto';

export class UpdateSystemConfigurationDto extends PartialType(CreateSystemConfigurationDto) {}
