import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleTypeDto } from './create-module_type.dto';

export class UpdateModuleTypeDto extends PartialType(CreateModuleTypeDto) {}
