import { PartialType } from '@nestjs/mapped-types';
import { CreateCodeSequenceDto } from './create-code_sequence.dto';

export class UpdateCodeSequenceDto extends PartialType(CreateCodeSequenceDto) {}
