import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SupplierCategoryService } from './supplier-category.service';
import { CreateSupplierCategoryDto } from './dto/create-supplier-category.dto';
import { UpdateSupplierCategoryDto } from './dto/update-supplier-category.dto';

@Controller('supplier-categories')
export class SupplierCategoryController {
  constructor(private readonly supplierCategoryService: SupplierCategoryService) {}

  @Post('create')
  async create(@Body() dto: CreateSupplierCategoryDto) {
    return this.supplierCategoryService.create(dto);
  }

  @Get('findAll')
  async findAll() {
    return this.supplierCategoryService.findAll();
  }

  @Get('findBy/:id')
  async findOne(@Param('id') id: number) {
    return this.supplierCategoryService.findOne(Number(id));
  }

  @Put('updateBy/:id')
  async update(@Param('id') id: number, @Body() dto: UpdateSupplierCategoryDto) {
    return this.supplierCategoryService.update(Number(id), dto);
  }

  @Delete('deleteBy/:id')
  async remove(@Param('id') id: number) {
    return this.supplierCategoryService.remove(Number(id));
  }
}
