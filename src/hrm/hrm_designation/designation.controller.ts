import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Query, Req } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('designations')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) { }


  @Get('list')
  async findAll(@Req() req: Request) {
    const company = req["user"].company_id;
    const designations = await this.designationService.findAll(company);
    return { status: true, message: "Get All Designations", data: designations };
  }


  @Post('create')
  async create(@Req() req: Request, @Body() dto: CreateDesignationDto) {
    const company = req["user"].company_id;
    const designations = await this.designationService.create(dto, company);
    return { status: true, message: "Designation Created Successfully", data: designations };
  }

  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const designation = await this.designationService.findOne(id);
    return { status: true, message: `Get Designation with ID ${id}`, data: designation };
  }

  @Put(':id/update')
  async update(@Req() req: Request, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDesignationDto) {
    const company = req["user"].company_id;
    const designations = await this.designationService.update(id, dto, company);
    return { status: true, message: "Designation Updated Successfully", data: designations };
  }

  @Get('toogleStatus/:id')
  statusChange(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const company = req["user"].company_id;
    return this.designationService.statusUpdate(id, company);
  }
}
