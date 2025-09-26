import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePosDto {
  @IsOptional()
  company_id?: number;

  @IsOptional()
  customer_id?: number;

  @IsNotEmpty()
  sale_person_id: number;

  @IsArray()
  order_details: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }[];
}
