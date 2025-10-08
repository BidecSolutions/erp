import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  // Create supplier
  @Post('create')
  async create(@Body() dto: CreateSupplierDto, @Req() req: any) {
    const companyId = req["user"].company_id;
    const supplier = await this.supplierService.create(dto, companyId);
    return {
      status: true,
      message: 'Supplier Created Successfully',
      data: supplier,
    };
  }

  // Get all suppliers for the company with optional active filter
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId = req["user"].company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const suppliers = await this.supplierService.findAll(companyId, filterStatus);
    return {
      status: true,
      message: 'Get All Suppliers',
      data: suppliers,
    };
  }

  // Get single supplier by ID
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const supplier = await this.supplierService.findOne(id);
    return {
      status: true,
      message: `Get Supplier with ID ${id}`,
      data: supplier,
    };
  }

  // Update supplier
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
    @Req() req: any,
  ) {
    const companyId = req["user"].company_id;
    const updated = await this.supplierService.update(id, dto, companyId);
    return {
      status: true,
      message: 'Supplier Updated Successfully',
      data: updated,
    };
  }

  // Delete supplier (soft delete)
  @Delete(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.supplierService.remove(id);
    return {
      status: true,
      message: 'Supplier Deleted Successfully',
      data: deleted,
    };
  }
}
