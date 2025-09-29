import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsInt,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { CreateSalesOrderDetailDto } from './sales-order-detail.dto';
import { SalesStatus } from 'src/sales/enums/sales-enums';

export class CreateSalesOrderDto {
  @IsDateString()
  @IsNotEmpty()
  order_date: Date;

  @IsEnum(SalesStatus)  // 👈 instead of IsString
  @IsNotEmpty()
  sales_status: SalesStatus;

  @IsString()
  @IsNotEmpty()
  order_no: string;

  @IsDateString()
  @IsOptional()
  expected_delivery_date?: Date;

  @IsDateString()
  @IsOptional()
  actual_delivery_date?: Date;

  @IsString()
  @IsOptional()
  order_priority?: string;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @IsNumber()
  @IsOptional()
  tax_amount?: number;

  @IsNumber()
  @IsOptional()
  discount_amount?: number;

  @IsNumber()
  @IsOptional()
  shipping_charges?: number;

  @IsNumber()
  @IsNotEmpty()
  total_amount: number;

  @IsString()
  @IsNotEmpty()
  order_status: string;

  @IsString()
  @IsOptional()
  delivery_status?: string;

  @IsString()
  @IsNotEmpty()
  payment_status: string;

  @IsString()
  @IsNotEmpty()
  currency_code: string;

  @IsNumber()
  @IsNotEmpty()
  exchange_rate: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  terms_conditions: string;

  @IsString()
  @IsNotEmpty()
  delivery_address: string;

  @IsNumber()
  @IsNotEmpty()
  company_id: number;

  @IsNumber()
  @IsNotEmpty()
  branch_id: number;

  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @IsNumber()
  @IsNotEmpty()
  sales_person_id: number;

  @IsInt()
  @IsOptional()
  created_by?: number;

  @IsInt()
  @IsOptional()
  updated_by?: number;

  @IsInt()
  @IsOptional()
  approved_by?: number;

  @IsDateString()
  @IsOptional()
  approved_date?: Date;

  @IsNumber()
  @IsOptional()
  status?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesOrderDetailDto)
  salesOrderDetails?: CreateSalesOrderDetailDto[];
}

export class UpdateSalesOrderDto extends PartialType(CreateSalesOrderDto) {

}
