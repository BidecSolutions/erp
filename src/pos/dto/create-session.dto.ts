// create-session.dto.ts
import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateSessionDto {
  @IsNumber()
  @Min(0)
  opening_balance: number;

  @IsOptional()
  @IsNumber()
  branch_id?: number;
}

// close-session.dto.ts
export class CloseSessionDto {
  @IsNumber()
  @Min(0)
  closing_balance: number;
}
