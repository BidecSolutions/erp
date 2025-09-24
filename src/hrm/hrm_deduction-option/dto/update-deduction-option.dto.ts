import { IsOptional } from 'class-validator';

export class UpdateDeductionOptionDto {
  @IsOptional()
  name?: string;
}
