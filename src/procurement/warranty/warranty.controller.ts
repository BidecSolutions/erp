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
async create(@Body() dto: CreateWarrantyDto, @Req() req: any) {
  const companyId = req.user.company_id; // assign company ID from JWT
  const warranty = await this.warrantyService.store(dto, companyId);
  
  return {
    status: true,
    message: 'Warranty Created Successfully',
    data: warranty,
  };
}


  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId = req.user.company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const warranty = await this.warrantyService.findAll(companyId, filterStatus);
    return {
      status: true,
      message: 'Get All Warranty',
      data: warranty,
    };
  }


  @Get(':id')
  async findOne(  @Param('id') id: string) {
    const warranty = await this.warrantyService.findOne(+id);
    return {
      status: true,
      message: `Get Warranty with ID ${id}`,
      data: warranty,
    };
  }

  @Put(':id')
  async update(
   @Param('id') id: string,
    @Body() dto: UpdateWarrantyDto,
    @Req() req: any,
  ) {
    const companyId = req.user.company_id;
    const updated = await this.warrantyService.update(+id, dto, companyId);
    return {
      status: true,
      message: 'Warranty Updated Successfully',
      data: updated,
    };
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.warrantyService.statusUpdate(id);
  }
}
