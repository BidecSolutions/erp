import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('brand')

export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post('store')
  create(@Body() createBrandDto: CreateBrandDto , @Req() req: Request) {
      const companyId = req["user"].company_id;
    return this.brandService.create(createBrandDto,companyId);
  }

  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.brandService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.statusUpdate(id);
  }

}
