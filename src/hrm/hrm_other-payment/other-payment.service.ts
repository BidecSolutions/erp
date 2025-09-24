// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { OtherPayment } from './other-payment.entity';
// import { CreateOtherPaymentDto } from './dto/create-other-payment.dto';
// import { UpdateOtherPaymentDto } from './dto/update-other-payment.dto';

// @Injectable()
// export class OtherPaymentService {
//   constructor(
//     @InjectRepository(OtherPayment)
//     private readonly otherPaymentRepo: Repository<OtherPayment>,
//   ) {}

//   async create(dto: CreateOtherPaymentDto) {
//     const newPayment = this.otherPaymentRepo.create(dto);
//     return await this.otherPaymentRepo.save(newPayment);
//   }

//   async findAll() {
//     return await this.otherPaymentRepo.find();
//   }

//   async findOne(id: number) {
//     const payment = await this.otherPaymentRepo.findOneBy({ id });
//     if (!payment) throw new NotFoundException(`Other Payment ID ${id} not found`);
//     return payment;
//   }

//   async update(id: number, dto: UpdateOtherPaymentDto) {
//     const payment = await this.findOne(id);
//     Object.assign(payment, dto);
//     return await this.otherPaymentRepo.save(payment);
//   }

//   async remove(id: number) {
//     const payment = await this.findOne(id);
//     await this.otherPaymentRepo.remove(payment);
//     return { message: `Other Payment ID ${id} deleted successfully` };
//   }
// }
