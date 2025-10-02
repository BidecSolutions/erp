// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateLoanOptionDto } from './dto/create-loan-option.dto';
// import { UpdateLoanOptionDto } from './dto/update-loan-option.dto';
// import { LoanOption } from './loan-option.entity';

// @Injectable()
// export class LoanOptionService {
//   constructor(
//     @InjectRepository(LoanOption)
//     private readonly optionRepo: Repository<LoanOption>,
//   ) {}

//   async create(dto: CreateLoanOptionDto) {
//     const option = this.optionRepo.create(dto);
//     return await this.optionRepo.save(option);
//   }

//   async findAll() {
//     return await this.optionRepo.find();
//   }

//   async findOne(id: number) {
//     const option = await this.optionRepo.findOneBy({ id });
//     if (!option) throw new NotFoundException(`Loan option ID ${id} not found`);
//     return option;
//   }

//   async update(id: number, dto: UpdateLoanOptionDto) {
//     const option = await this.findOne(id);
//     Object.assign(option, dto);
//     return await this.optionRepo.save(option);
//   }

//   async remove(id: number) {
//     const option = await this.findOne(id);
//     await this.optionRepo.remove(option);
//     return { message: `Loan option ID ${id} deleted successfully` };
//   }
// }
