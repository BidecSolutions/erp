import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { UnitOfMeasureService } from './unit_of_measure.service';
import { CreateUnitOfMeasureDto } from './dto/create-unit_of_measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit_of_measure.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('unit-of-measure')
export class UnitOfMeasureController {
  constructor(private readonly unitOfMeasureService: UnitOfMeasureService) {}

  @Post('store')
  async create(@Body() dto: CreateUnitOfMeasureDto, @Req() req: any) {
    const companyId = req.user.company_id;
    const unitOfMeasure = await this.unitOfMeasureService.create(dto, companyId);
    return {
      status: true,
      message: 'Unit Of Measure Created Successfully',
      data: unitOfMeasure,
    };
  }

  // Get all allowances for company with optional status filter
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId = req.user.company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const unitOfMeasure = await this.unitOfMeasureService.findAll(companyId, filterStatus);
    return {
      status: true,
      message: 'Get All Unit Of Measure',
      data: unitOfMeasure,
    };
  }

   @Get(':id/')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const unitOfMeasure = await this.unitOfMeasureService.findOne(id);
    return {
      status: true,
      message: `Get Unit Of Measure with ID ${id}`,
      data: unitOfMeasure,
    };
  }

    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateUnitOfMeasureDto,
      @Req() req: any,
    ) {
      const companyId = req.user.company_id;
      const updated = await this.unitOfMeasureService.update(id, dto, companyId);
      return {
        status: true,
        message: 'Unit Of Measure Updated Successfully',
        data: updated,
      };
    }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.unitOfMeasureService.statusUpdate(id);
  }

}
