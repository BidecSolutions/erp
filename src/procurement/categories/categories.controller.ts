import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('store')
  create(@Body() dto: CreateCategoryDto ,@Req() req: Request) {
          const companyId = req["user"].company_id;
    return this.categoriesService.create(dto , companyId);
  }
  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.categoriesService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.statusUpdate(id);
  }

}
