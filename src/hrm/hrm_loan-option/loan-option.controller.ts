// import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
// import { CreateLoanOptionDto } from './dto/create-loan-option.dto';
// import { UpdateLoanOptionDto } from './dto/update-loan-option.dto';
// import { LoanOptionService } from './loan-option.service';

// @Controller('loan-option')
// export class LoanOptionController {
//   constructor(private readonly optionService: LoanOptionService) {}

//   @Post('create')
//   create(@Body() dto: CreateLoanOptionDto) {
//     return this.optionService.create(dto);
//   }

//   @Get('list')
//   findAll() {
//     return this.optionService.findAll();
//   }

//   @Get(':id/get')
//   findOne(@Param('id') id: number) {
//     return this.optionService.findOne(+id);
//   }

//   @Put(':id/update')
//   update(@Param('id') id: number, @Body() dto: UpdateLoanOptionDto) {
//     return this.optionService.update(+id, dto);
//   }

//   @Delete(':id/delete')
//   remove(@Param('id') id: number) {
//     return this.optionService.remove(+id);
//   }
// }
