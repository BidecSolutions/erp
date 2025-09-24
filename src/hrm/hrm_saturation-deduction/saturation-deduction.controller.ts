// import { Controller, Post, Get, Param, Delete, Body, Put } from '@nestjs/common';
// import { SaturationDeductionService } from './saturation-deduction.service';
// import { CreateSaturationDeductionDto } from './dto/create-saturation-deduction.dto';
// import { UpdateSaturationDeductionDto } from './dto/update-saturation-deduction.dto';

// @Controller('saturation-deduction')
// export class SaturationDeductionController {
//   constructor(private readonly deductionService: SaturationDeductionService) {}

//   @Post('create')
//   create(@Body() dto: CreateSaturationDeductionDto) {
//     return this.deductionService.create(dto);
//   }

//   @Get('list')
//   findAll() {
//     return this.deductionService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.deductionService.findOne(id);
//   }

//   @Put(':id')
//   update(@Param('id') id: number, @Body() dto: UpdateSaturationDeductionDto) {
//     return this.deductionService.update(id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.deductionService.remove(id);
//   }
// }
