import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceConfig } from './attendance-config.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

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

  //  3️ Mark or Update Attendance
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
  @Post('auto-mark-absent')
async autoMarkAbsent(@Req() req: any) {
  const company_id = req.user.company_id;
  return await this.attendanceService.autoMarkAbsentToday(company_id);
}

}
