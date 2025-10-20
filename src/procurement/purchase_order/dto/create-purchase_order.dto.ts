import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, ValidateNested, IsUUID, IsInt, IsNumber, IsEnum, IsEmpty, IsDateString } from 'class-validator';
import { PurchaseOrderStatus } from 'src/procurement/enums/purchase-order.enum';


export class CreatePurchaseOrderDto {
    @IsNumber()
    @IsNotEmpty()
    supplier_id: number;

    @IsNumber()
    @IsNotEmpty()
    pr_id: number;

     @IsNumber()
    @IsNotEmpty()
    pq_id: number;

    @IsNumber()
    @IsNotEmpty()
    branch_id: number;

    @IsDateString()
    @IsNotEmpty()
    order_date: string;

    @IsDateString()
    @IsNotEmpty()
    expected_delivery_date: string;


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
