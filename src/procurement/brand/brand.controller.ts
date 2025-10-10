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
  create(@Body() createBrandDto: CreateBrandDto, @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.brandService.create(createBrandDto, companyId, userId);
  }

  @Get('list')
  findAll(@Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.brandService.findAll(companyId);
  }
  @Get(':id')
  findOne(@Param('id') id: string,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.brandService.findOne(+id,companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,

    @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;

    return this.brandService.update(+id, updateBrandDto, userId, companyId);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.statusUpdate(id);
  }

}
