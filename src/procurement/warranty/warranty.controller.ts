import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, Put, UseGuards } from '@nestjs/common';
import { WarrantyService } from './warranty.service';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('warranty')
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) {}

  @Post('store')
  create(@Body() dto: CreateWarrantyDto , @Req() req: Request) {
      const companyId = req["user"].company_id;
    return this.warrantyService.create(dto,companyId);
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
  update(@Param('id') id: string, @Body() dto: UpdateWarrantyDto) {
    return this.warrantyService.update(+id, dto);
  }
   @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.warrantyService.statusUpdate(id);
  
}
}
