import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  // Create LeaveType
  @Post('create')
  async create(@Body() dto: CreateLeaveTypeDto, @Req() req: any) {
    const companyId = req["user"].company_id;
    const leaveTypes = await this.leaveTypeService.create(dto, companyId);
    return {
      status: true,
      message: 'Leave Type Created Successfully',
      data: leaveTypes,
    };
  }

  // Get all LeaveTypes for a company with optional status filter
  @Get('list')
  async findAll(@Req() req: any) {
    const companyId = req["user"].company_id;
    const leaveTypes = await this.leaveTypeService.findAll(companyId);
    return {
      status: true,
      message: 'Get All Leave Types',
      data: leaveTypes,
    };
  }

  // Get single LeaveType by ID
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const leaveType = await this.leaveTypeService.findOne(id);
    return {
      status: true,
      message: `Get Leave Type with ID ${id}`,
      data: leaveType,
    };
  }

  // Update LeaveType
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLeaveTypeDto,
    @Req() req: any,
  ) {
    const companyId = req["user"].company_id;
    const updated = await this.leaveTypeService.update(id, dto, companyId);
    return {
      status: true,
      message: 'Leave Type Updated Successfully',
      data: updated,
    };
  }

  // Toggle LeaveType status
  @Get('toogleStatus/:id')
  async statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.leaveTypeService.statusUpdate(id);
  }
}
