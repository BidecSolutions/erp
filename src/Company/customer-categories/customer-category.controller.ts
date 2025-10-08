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
  Req,
  Query,
} from '@nestjs/common';
import { CustomerCategoryService } from './customer-category.service';
import { CreateCustomerCategoryDto } from './dto/create-customer-category.dto';
import { UpdateCustomerCategoryDto } from './dto/update-customer-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('customer-categories')
export class CustomerCategoryController {
  constructor(private readonly categoryService: CustomerCategoryService) { }

  //  Create category
  @Post('create')
  async create(@Body() dto: CreateCustomerCategoryDto, @Req() req: any) {
    const companyId =  req["user"].company_id;
    const result = await this.categoryService.create(dto, companyId);

    return {
      status: true,
      message: 'Customer category created successfully',
      data: result,
    };
  }

  //  List all categories
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId =  req["user"].company_id;
    const result = await this.categoryService.findAll(companyId);

    return {
      status: true,
      message: 'Get All Customer categories',
      data: result,
    };
  }

  //  Get single category
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.categoryService.findOne(id);

    return {
      status: true,
      message: `Get Customer category with ID ${id}`,
      data: result,
    };
  }

  //  Update category
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerCategoryDto,
    @Req() req: any,
  ) {
    const companyId =  req["user"].company_id;
    const result = await this.categoryService.update(id, dto, companyId);

    return {
      status: true,
      message: 'Customer category updated successfully',
      data: result,
    };
  }

  @Get('toogleStatus/:id')
  async statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.statusUpdate(id);
  }
}
