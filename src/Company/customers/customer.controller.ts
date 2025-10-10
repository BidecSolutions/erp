import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Create customer
  @Post('create')
  async create(@Body() dto: CreateCustomerDto, @Req() req: any) {
    const companyId =  req["user"].company_id;;
    const customer = await this.customerService.create(dto, companyId);
    return {
      status: true,
      message: 'Customer Created Successfully',
      data: customer,
    };
  }

  // Get all customers for company (optional status filter)
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId =  req["user"].company_id;;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const customers = await this.customerService.findAll(companyId, filterStatus);
    return {
      status: true,
      message: 'Get All Customers',
      data: customers,
    };
  }

  // Get single customer by ID
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customerService.findOne(id);
    return {
      status: true,
      message: `Get Customer with ID ${id}`,
      data: customer,
    };
  }

  // Update customer
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto,
    @Req() req: any,
  ) {
    const companyId =  req["user"].company_id;
    const updated = await this.customerService.update(id, dto, companyId);
    return {
      status: true,
      message: 'Customer Updated Successfully',
      data: updated,
    };
  }

    @Get('toogleStatus/:id')
            async statusChange(@Param('id', ParseIntPipe) id: number) {
              return this.customerService.statusUpdate(id);
            }
}
