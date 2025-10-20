import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceConfig } from './attendance-config.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtEmployeeAuth } from "src/auth/jwt-employee.guard";

@UseGuards(JwtEmployeeAuth)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  //   Create or Update Config (based on company token)
  @Post('config')
  async createOrUpdateConfig(@Body() dto: Partial<AttendanceConfig>, @Req() req: any) {
    const company_id = req.user.company_id;
    return await this.attendanceService.createOrUpdateConfig(dto, company_id);
  }


  //   Get Active Config for Logged-in Company
  @Get('config/get')
  async getConfig(@Req() req: any) {
    const company_id = req.user.company_id;
    const config = await this.attendanceService.getActiveConfig(company_id);
    return {
      status: config.status,
      message: config.message,
      data: config.data,
    };
  }

  //   Mark or Update Attendance
  @Post('mark')
  async markAttendance(@Body() dto: CreateAttendanceDto, @Req() req: any) {
    const company_id = req.user.company_id;
    const result = await this.attendanceService.markAttendance(dto, company_id);

    return {
      status: result.status,
      message: result.message,
      data: result.data,
    };
  }

<<<<<<< HEAD
  @Post('auto-mark-absent')
  async autoMarkAbsent(@Req() req: any) {
    const company_id = req.user.company_id;
    return await this.attendanceService.autoMarkAbsentToday(company_id);
  }
=======
  @Post('auto-mark')
async autoMarkAbsent(@Req() req: any) {
  const company_id = req.user.company_id;
  return await this.attendanceService.autoMarkAbsentToday(company_id);
}
>>>>>>> 89ec5ccbf0a7f9d2d75a1913ce1499dd20e0c67d

  //  Get all employees' attendance for a specific date
  @Get('all/:date')
  async getAllEmployeesAttendance(
    @Param('date') date: string,
    @Req() req: any,
  ) {
    const company_id = req.user.company_id;
    return await this.attendanceService.getAllEmployeesAttendance(date, company_id);
  }

  @Get(':employeeId/:date')
  async getSingleDayAttendance(
    @Param('employeeId') employeeId: number,
    @Param('date') date: string,
    @Req() req: any,
  ) {
    const company_id = req.user.company_id;
    return await this.attendanceService.getSingleDayAttendance(employeeId, date, company_id);
  }
  @Post('bulk-month')
  async bulkMonthAttendance(
    @Req() req: any,
    @Body() body: { employee_ids: number[]; month: number; year: number; check_in?: string; check_out?: string }
  ) {
    const company_id = req.user?.company_id; // company_id extracted from JWT token
    if (!company_id) throw new BadRequestException('Company not found in token');

    return this.attendanceService.bulkMonthAttendance(
      company_id,
      body.employee_ids,
      body.month,
      body.year,
      body.check_in,
      body.check_out
    );
  }

@Post('update/:employeeId/:date')
async updateSpecificDate(
  @Param('employeeId', ParseIntPipe) employeeId: number,
  @Param('date') date: string,
  @Body() dto: { check_in?: string; check_out?: string },
  @Req() req: any
) {
  const company_id = req.user.company_id;
  return await this.attendanceService.updateAttendanceForDate(employeeId, date, dto, company_id);
}




}
