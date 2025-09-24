import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get('findAll')
  findAll() {
    return this.customerService.findAll();
  }

  @Get('findby/:id')
  findOne(@Param('id') id: number) {
    return this.customerService.findOne(id);
  }

  @Put('updateby/:id')
  update(@Param('id') id: number, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete('deleteby/:id')
  remove(@Param('id') id: number) {
    return this.customerService.remove(id);
  }
}
