import { IsNotEmpty, IsString, IsArray, ValidateNested, IsUUID, IsInt, IsNumber, IsEnum, IsEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseRequestStatus, PurchaseRequestType } from 'src/procurement/enums/purchase-request.enum';
import { CreatePurchaseRequestItemDto } from './create-purchase-request-item.dto';


export class CreatePurchaseRequestDto {

    @IsString()
    remarks?: string;

    @IsNumber()
    @IsNotEmpty()
    module_type?: number;

    @IsNotEmpty()
    @IsEnum(PurchaseRequestType, { message: 'Invalid type' })
    pr_type: PurchaseRequestType;

    @IsOptional()
    @IsEnum(PurchaseRequestStatus, { message: 'Invalid status' })
    default: PurchaseRequestStatus.PENDING // default value
    pr_status: PurchaseRequestStatus;

    @IsNotEmpty()
    @IsNumber()
    branch_id: number

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseRequestItemDto)
    items?: CreatePurchaseRequestItemDto[];


}



