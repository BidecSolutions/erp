// import { Controller, Post, Get, Param, Delete, Put, Body } from '@nestjs/common';
// import { OvertimeService } from './overtime.service';
// import { CreateOvertimeDto } from './dto/create-overtime.dto';
// import { UpdateOvertimeDto } from './dto/update-overtime.dto';

// @Controller('overtime')
// export class OvertimeController {
//   constructor(private readonly overtimeService: OvertimeService) {}

//   @Post('create')
//   create(@Body() dto: CreateOvertimeDto) {
//     return this.overtimeService.create(dto);
//   }

//   @Get('list')
//   findAll() {
//     return this.overtimeService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.overtimeService.findOne(id);
//   }

//   @Put(':id')
//   update(@Param('id') id: number, @Body() dto: UpdateOvertimeDto) {
//     return this.overtimeService.update(id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.overtimeService.remove(id);
//   }
// }
