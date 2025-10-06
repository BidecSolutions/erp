// import { Controller, Post, Get, Param, Delete, Body, Put } from '@nestjs/common';
// import { AttendanceService } from './mark-attendance.service';
// import { CreateAttendanceDto } from './dto/create-mark-attendance.dto';
// import { UpdateAttendanceDto } from './dto/update-mark-attendance.dto';

// @Controller('markattendance')
// export class AttendanceController {
//   constructor(private readonly attendanceService: AttendanceService) {}

//   @Post('create')
//   create(@Body() dto: CreateAttendanceDto) {
//     return this.attendanceService.create(dto);
//   }

//   @Get('list')
//   findAll() {
//     return this.attendanceService.findAll();
//   }

//   @Get(':id/get')
//   findOne(@Param('id') id: number) {
//     return this.attendanceService.findOne(id);
//   }

//   @Put(':id/update')
//   update(@Param('id') id: number, @Body() dto: UpdateAttendanceDto) {
//     return this.attendanceService.update(id, dto);
//   }

//   @Delete(':id/delete')
//   remove(@Param('id') id: number) {
//     return this.attendanceService.remove(id);
//   }
// }
