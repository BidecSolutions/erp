import { IsNotEmpty, IsOptional, IsUrl, IsNumber, IsDateString } from 'class-validator';

export class CreateSystemConfigurationDto {
  @IsNotEmpty()
  company_id: number;

  @IsOptional()
  is_recurring?: number;

  @IsOptional()
  @IsDateString()
  recurring_date?: string;

  @IsOptional()
  @IsNumber()
  recurring_amount?: number;

  @IsOptional()
  @IsUrl()
  facebook_link?: string;

  @IsOptional()
  @IsUrl()
  youtube_link?: string;

  @IsOptional()
  @IsUrl()
  linkdin_link?: string;
}
