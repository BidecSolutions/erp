import { Type } from 'class-transformer';
import { CreateEmpRoasterDto } from './create-emp-roaster.dto';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateEmpRoasterDto extends CreateEmpRoasterDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number; // optional ID for existing roasters
}
