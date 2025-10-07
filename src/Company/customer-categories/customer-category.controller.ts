import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CustomerCategoryService } from './customer-category.service';
import { CreateCustomerCategoryDto } from './dto/create-customer-category.dto';
import { UpdateCustomerCategoryDto } from './dto/update-customer-category.dto';

@Controller('customer-categories')
export class CustomerCategoryController {
  constructor(private readonly categoryService: CustomerCategoryService) {}

  @Post('create')
  create(@Body() dto: CreateCustomerCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get('list')
  findAll(@Query('inactive') inactive?: number) {
    return this.categoryService.findAll(inactive);
  }

  @Get('findBy/:id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(+id);
  }

  @Put('updateBy/:id')
  update(@Param('id') id: number, @Body() dto: UpdateCustomerCategoryDto) {
    return this.categoryService.update(+id, dto);
  }

  @Delete('deleteBy/:id')
  softDelete(@Param('id') id: number) {
    return this.categoryService.softDelete(+id);
  }
}
