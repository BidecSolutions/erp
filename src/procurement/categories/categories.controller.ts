import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // Create category
  @Post('store')
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.categoriesService.create(createCategoryDto, companyId, userId);
  }

  @Get('list')
  findAll(@Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.categoriesService.findAll(companyId);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateCategoryDto: UpdateCategoryDto,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;

    return this.categoriesService.update(+id, UpdateCategoryDto,companyId,userId);
  }
  
  @Get('toogleStatus/:id')
  async statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.statusUpdate(id);
  }
}
