import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Post('create')
    create(@Body() dto: CreateSupplierDto) {
        return this.supplierService.create(dto);
    }

    @Get('findAll')
    findAll() {
        return this.supplierService.findAll();
    }

    @Get('findBy/:id')
    findOne(@Param('id') id: number) {
        return this.supplierService.findOne(+id);
    }

    @Put('updateBy/:id')
    update(@Param('id') id: number, @Body() dto: UpdateSupplierDto) {
        return this.supplierService.update(+id, dto);
    }

    @Delete('deleteBy/:id')
    remove(@Param('id') id: number) {
        return this.supplierService.remove(+id);
    }
}
