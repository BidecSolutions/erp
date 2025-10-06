import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create category
  @Post('store')
  async create(@Body() dto: CreateCategoryDto, @Req() req: any) {
    const companyId = req.user.company_id; // Assign company ID like allowance
    const category = await this.categoriesService.create(dto, companyId);
    return {
      status: true,
      message: 'Category Created Successfully',
      data: category,
    };
  }

  // Get all categories with optional filter
  @Get('list')
  async findAll(@Req() req: any, @Query('filter') filter?: string) {
    const companyId = req.user.company_id;
    const filterStatus = filter !== undefined ? Number(filter) : undefined;
    const categories = await this.categoriesService.findAll(companyId, filterStatus);
    return {
      status: true,
      message: 'Get All Categories successfully',
      data: categories,
    };
  }

  // Get single category by ID
  @Get(':id/')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    return {
      status: true,
      message: `Get Category with ID ${id}`,
      data: category,
    };
  }

  // Update category
  @Patch(':id/')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @Req() req: any,
  ) {
    const companyId = req.user.company_id;
    const updated = await this.categoriesService.update(id, dto, companyId);
    return {
      status: true,
      message: 'Category Updated Successfully',
      data: updated,
    };
  }

  // Toggle category status
  @Get('toogleStatus/:id')
  async statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.statusUpdate(id);
  }
}
