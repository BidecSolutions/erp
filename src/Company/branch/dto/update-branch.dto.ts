import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchDto } from './create-branch.dto';
import { IsOptional } from 'class-validator';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
 
  @IsOptional()
  branch_code: string;

  @IsOptional()
  branch_name: string;
}
