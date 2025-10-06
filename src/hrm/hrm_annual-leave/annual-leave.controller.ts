import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AnnualLeaveService } from './annual-leave.service';
import { CreateAnnualLeaveDto } from './dto/create-annual-leave.dto';
import { UpdateAnnualLeaveDto } from './dto/update-annual-leave.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('annual-leave')
export class AnnualLeaveController {
  constructor(private readonly annualLeaveService: AnnualLeaveService) {}

  @Post('create')
  async create(@Body() dto: CreateAnnualLeaveDto, @Req() req: any) {
    const company_id = req.user.company_id;
    const leaves = await this.annualLeaveService.create(dto, company_id);
    return { status: true, message: 'Annual Leave Created Successfully', data: leaves };
  }

  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const company_id = req.user.company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const leaves = await this.annualLeaveService.findAll(company_id, filterStatus);
    return { status: true, message: 'Get All Annual Leaves', data: leaves };
  }

  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const leave = await this.annualLeaveService.findOne(id);
    return { status: true, message: `Get Annual Leave with ID ${id}`, data: leave };
  }

  @Put(':id/update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnnualLeaveDto, @Req() req: any) {
    const company_id = req.user.company_id;
    const updated = await this.annualLeaveService.update(id, dto, company_id);
    return { status: true, message: 'Annual Leave Updated Successfully', data: updated };
  }


  @Get('toogleStatus/:id')
  async statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.annualLeaveService.statusUpdate(id);
  }
}
