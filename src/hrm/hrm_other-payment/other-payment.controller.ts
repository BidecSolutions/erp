// import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
// import { OtherPaymentService } from './other-payment.service';
// import { CreateOtherPaymentDto } from './dto/create-other-payment.dto';
// import { UpdateOtherPaymentDto } from './dto/update-other-payment.dto';

// @Controller('other-payment')
// export class OtherPaymentController {
//   constructor(private readonly otherPaymentService: OtherPaymentService) {}

//   @Post('create')
//   create(@Body() dto: CreateOtherPaymentDto) {
//     return this.otherPaymentService.create(dto);
//   }

//   @Get('list')
//   findAll() {
//     return this.otherPaymentService.findAll();
//   }

//   @Get(':id/get')
//   findOne(@Param('id') id: number) {
//     return this.otherPaymentService.findOne(id);
//   }

//   @Put(':id/update')
//   update(@Param('id') id: number, @Body() dto: UpdateOtherPaymentDto) {
//     return this.otherPaymentService.update(id, dto);
//   }

//   @Delete(':id/delete')
//   remove(@Param('id') id: number) {
//     return this.otherPaymentService.remove(id);
//   }
// }
