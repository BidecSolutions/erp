import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SupplierCategoryService } from './supplier-category.service';
import { CreateSupplierCategoryDto } from './dto/create-supplier-category.dto';
import { UpdateSupplierCategoryDto } from './dto/update-supplier-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('supplier-categories')
export class SupplierCategoryController {
  constructor(private readonly supplierCategoryService: SupplierCategoryService) {}

  // Create supplier category
  @Post('create')
  async create(@Body() dto: CreateSupplierCategoryDto, @Req() req: any) {
    const companyId = req.user.company_id;
    const categories = await this.supplierCategoryService.create(dto, companyId);
    return {
      status: true,
      message: 'Supplier Category Created Successfully',
      data: categories,
    };
  }

  // Get all supplier categories for company
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId = req.user.company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const categories = await this.supplierCategoryService.findAll(companyId, filterStatus);
    return {
      status: true,
      message: 'Get All Supplier Categories',
      data: categories,
    };
  }

  // Get single supplier category by ID
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.supplierCategoryService.findOne(id);
    return {
      status: true,
      message: `Get Supplier Category with ID ${id}`,
      data: category,
    };
  }

  // Update supplier category
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierCategoryDto,
    @Req() req: any,
  ) {
    const companyId = req.user.company_id;
    const updated = await this.supplierCategoryService.update(id, dto, companyId);
    return {
      status: true,
      message: 'Supplier Category Updated Successfully',
      data: updated,
    };
  }

  // Soft delete supplier category
  @Delete(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.supplierCategoryService.remove(id);
    return {
      status: true,
      message: 'Supplier Category Deleted Successfully',
      data: deleted,
    };
  }
}
