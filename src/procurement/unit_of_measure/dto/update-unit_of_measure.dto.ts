import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitOfMeasureDto } from './create-unit_of_measure.dto';

export class UpdateUnitOfMeasureDto extends PartialType(CreateUnitOfMeasureDto) {}
