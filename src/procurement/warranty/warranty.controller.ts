import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, Put, UseGuards } from '@nestjs/common';
import { WarrantyService } from './warranty.service';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('warranty')
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) { }

  @Post('store')
  create(@Body() dto: CreateWarrantyDto, @Req() req: Request) {
      const userData = req["user"];
      const userId = userData?.user?.id;
      const companyId = userData?.company_id;
    return this.warrantyService.create(dto,userId, companyId);
  }

@Get('list')
findAll(@Req() req: Request,@Query('filter') filter?: string) {
     const companyId = req["user"].company_id; // ✅ from token or session
  return this.warrantyService.findAll(
    companyId,
    filter !== undefined ? Number(filter) : undefined,
  );
}

  @Get(':id')
  findOne(@Req() req: Request,@Param('id') id: string) {
     const companyId = req["user"].company_id;
    return this.warrantyService.findOne(+id, companyId);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateWarrantyDto) {
      const userData = req["user"];
      const userId = userData?.user?.id;
      const companyId = userData?.company_id;
    return this.warrantyService.update(+id, dto,userId, companyId);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.warrantyService.statusUpdate(id);

  }
}
