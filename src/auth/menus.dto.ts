import { IsString, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreatePermissionDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    status?: number;
}

class CreateSubMenuDto {
    @IsString()
    name: string;

    @IsString()
    link: string;

    @IsOptional()
    @IsNumber()
    status?: number;

    @ValidateNested({ each: true })
    @Type(() => CreatePermissionDto)
    permissions: CreatePermissionDto[];
}

export class CreateMenuDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    status?: number;

    @ValidateNested({ each: true })
    @Type(() => CreateSubMenuDto)
    subMenus: CreateSubMenuDto[];
}
