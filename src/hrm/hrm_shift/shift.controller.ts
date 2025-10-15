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
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) { }

  //  Create Shift
  @Post('create')
  async create(@Body() dto: CreateShiftDto, @Req() req: any) {
    const companyId = req["user"].company_id;
    const shifts = await this.shiftService.create(dto, companyId);
    return {
      status: true,
      message: 'Shift Created Successfully',
      data: shifts,
    };
  }

  //  Get all Shifts (with optional status filter)
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId = req["user"].company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const shifts = await this.shiftService.findAll(companyId);
    return {
      status: true,
      message: 'Get All Shifts',
      data: shifts,
    };
  }

  //  Get single shift
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const shift = await this.shiftService.findOne(id);
    return {
      status: true,
      message: `Get Shift with ID ${id}`,
      data: shift,
    };
  }

  // // Update Shift
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShiftDto,
    @Req() req: any,
  ) {
    const companyId = req["user"].company_id;
    const updated = await this.shiftService.update(id, dto, companyId);
    return {
      status: true,
      message: 'Shift Updated Successfully',
      data: updated,
    };
  }

  // // // Delete Shift
  // @Delete(':id/delete')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   const deleted = await this.shiftService.remove(id);
  //   return {
  //     status: true,
  //     message: `Shift ID ${id} Deleted Successfully`,
  //     data: deleted,
  //   };
  // }

  // // Toggle Status
  @Get('toogleStatus/:id')
  async statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.shiftService.statusUpdate(id);
  }
}
