import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { WarrantyService } from './warranty.service';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';

@Controller('warranty')
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) {}

@Post('store')
  create(@Body() createBrandDto: CreateWarrantyDto) {
    return this.warrantyService.store(createBrandDto);
  }

   @Get('list')
   findAll(@Query('filter') filter?: string) {
     return this.warrantyService.findAll(
       filter !== undefined ? Number(filter) : undefined,
     );
   }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warrantyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateWarrantyDto) {
    return this.warrantyService.update(+id, updateBrandDto);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.warrantyService.statusUpdate(id);
  }
}
