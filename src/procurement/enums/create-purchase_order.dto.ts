import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, ValidateNested, IsUUID, IsInt, IsNumber, IsEnum, IsEmpty } from 'class-validator';

export class CreatePurchaseOrderDto {

    @IsNumber()
    @IsNotEmpty()
    pr_id: number;


    @IsNumber()
    @IsNotEmpty()
    supplier_id: number;

    @IsNumber()
    @IsNotEmpty()
    company_id: number;

    @IsNumber()
    @IsNotEmpty()
    branch_id: number;

    @IsString()
    @IsNotEmpty()
    order_date: Date;
    @IsString()
    @IsNotEmpty()
    expected_delivery_date: Date;


    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseOrderItemDto)
    items: CreatePurchaseOrderItemDto[];


}

export class CreatePurchaseOrderItemDto {
    @IsNumber()
    @IsNotEmpty()

    product_id: number;
    @IsNumber()
    @IsNotEmpty()
    variant_id: number;
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
    @IsNumber()
    @IsNotEmpty()
    unit_price: number;
}
