import { Controller, Post, Body } from '@nestjs/common';
import { BulkAttendanceService } from './bulk-attendance.service';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';

@Controller('bulk-attendance')
export class BulkAttendanceController {
  constructor(private readonly bulkService: BulkAttendanceService) {}

  @Post()
  async markBulk(@Body() dto: BulkAttendanceDto) {
    return this.bulkService.markBulk(dto);
  }
}
