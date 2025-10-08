import { Controller, Post, Body, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceConfigDto } from './dto/attendance-config.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceConfig } from './attendance-config.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('config')
  async createOrUpdate(@Body() dto: Partial<AttendanceConfig>, @Req() req: any) {
    const company_id = req.user.company_id;
    const config = await this.attendanceService.createOrUpdateConfig(dto, company_id);
    return { status: true, message: 'Config saved successfully', data: config };
  }

  @Get('config/get')
 async get(@Req() req: any) {
    const company_id = req.user.company_id;
    const config = await this.attendanceService.getActiveConfig(company_id);
    return { status: true, message: 'Config fetched successfully', data: config };
  }
  @Post('mark')
async mark(
  @Body() dto: CreateAttendanceDto,
  @Req() req: any, // JWT guard ensures req.user exists
) {
  const company_id = req.user.company_id; // 👈 automatically from token
  return this.attendanceService.markAttendance(dto, company_id);
}

  @Get(':employeeId/:date')
  getDay(
    @Param('employeeId') employeeId: number,
    @Param('date') date: string,
  ) {
    return this.attendanceService.getAttendanceByEmployeeAndDate(employeeId, date);
  }

  @Get('report/:employeeId/:month')
  getReport(
    @Param('employeeId') employeeId: number,
    @Param('month') month: string,
  ) {
    return this.attendanceService.getMonthlyReport(employeeId, month);
  }
}
