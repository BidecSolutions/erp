import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePosDto {
  @IsOptional()
  company_id?: number;

  @IsOptional()
  customer_id?: number;

  @IsOptional()
  sale_person_id: number;

  @IsOptional()
  @IsString()
  order_no: string; 

  @IsArray()
  order_details: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }[];
}
