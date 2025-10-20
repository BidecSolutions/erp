import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  Put,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtEmployeeAuth } from "src/auth/jwt-employee.guard";

@UseGuards(JwtEmployeeAuth)
@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) { }

  // Create Holiday
  @Post('create')
  async create(@Body() dto: CreateHolidayDto, @Req() req: any) {
    const company_id = req.user.company_id;
    return await this.holidayService.create(dto, company_id);
  }

  // Get All Holidays (by token’s company_id)
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const company_id = req.user.company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return await this.holidayService.findAll(company_id, filterStatus);
  }

  // Get One Holiday
  @Get(':id/get')
  async findOne(@Param('id') id: number, @Req() req: any) {
    const company_id = req.user.company_id;
    return await this.holidayService.findOne(id, company_id);
  }

  // Update Holiday
  @Put(':id/update')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateHolidayDto,
    @Req() req: any,
  ) {
    const company_id = req.user.company_id;
    return await this.holidayService.update(id, dto, company_id);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.holidayService.statusUpdate(id);
  }

}
