import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


UseGuards(JwtAuthGuard)
@Controller('designations')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) { }


  @Get('list')
  async findAll(@Query('status') status?: string) {
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const designations = await this.designationService.findAll(filterStatus);
    return { status: true, message: "Get All Designations", data: designations };
  }

 
  @Post('create')
  async create(@Body() dto: CreateDesignationDto) {
    const designations = await this.designationService.create(dto);
    return { status: true, message: "Designation Created Successfully", data: designations };
  }


 
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const designation = await this.designationService.findOne(id);
    return { status: true, message: `Get Designation with ID ${id}`, data: designation };
  }

  @Put(':id/update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDesignationDto) {
    const designations = await this.designationService.update(id, dto);
    return { status: true, message: "Designation Updated Successfully", data: designations };
  }

      @Get('toogleStatus/:id')
      statusChange(@Param('id', ParseIntPipe) id: number){
        return this.designationService.statusUpdate(id);
      }
}
