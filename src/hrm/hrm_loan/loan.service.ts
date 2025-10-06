// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Loan } from './loan.entity';
// import { CreateLoanDto } from './dto/create-loan.dto';
// import { UpdateLoanDto } from './dto/update-loan.dto';
// import { LoanOption } from 'src/hrm/hrm_loan-option/loan-option.entity';

// @Injectable()
// export class LoanService {
//   constructor(
//     @InjectRepository(Loan)
//     private readonly loanRepo: Repository<Loan>,

//     @InjectRepository(LoanOption)
//     private readonly loanOptionRepo: Repository<LoanOption>,
//   ) {}

//   async create(dto: CreateLoanDto) {
//     const loanOption = await this.loanOptionRepo.findOneBy({ id: dto.loanOption });
//     if (!loanOption) throw new NotFoundException('Loan Option not found');

//     const loan = this.loanRepo.create({
//       ...dto,
//       loanOption,
//     });

//     const saved = await this.loanRepo.save(loan);
//     return {
//       id: saved.id,
//       title: saved.title,
//       loanOption: loanOption.name,
//       type: saved.type,
//       loanAmount: saved.loanAmount,
//       startDate: saved.startDate,
//       endDate: saved.endDate,
//       reason: saved.reason,
//     };
//   }

//   async findAll() {
//     const loans = await this.loanRepo.find({ relations: ['loanOption'] });
//     return loans.map(l => ({
//       id: l.id,
//       title: l.title,
//       loanOption: l.loanOption?.name || null,
//       type: l.type,
//       loanAmount: l.loanAmount,
//       startDate: l.startDate,
//       endDate: l.endDate,
//       reason: l.reason,
//     }));
//   }

//   async findOne(id: number) {
//     const loan = await this.loanRepo.findOne({ where: { id }, relations: ['loanOption'] });
//     if (!loan) throw new NotFoundException('Loan record not found');

//     return {
//       id: loan.id,
//       title: loan.title,
//       loanOption: loan.loanOption?.name || null,
//       type: loan.type,
//       loanAmount: loan.loanAmount,
//       startDate: loan.startDate,
//       endDate: loan.endDate,
//       reason: loan.reason,
//     };
//   }

//   async update(id: number, dto: UpdateLoanDto) {
//     const loan = await this.loanRepo.findOneBy({ id });
//     if (!loan) throw new NotFoundException('Loan not found');

//     if (dto.loanOption) {
//       const loanOption = await this.loanOptionRepo.findOneBy({ id: dto.loanOption });
//       if (!loanOption) throw new NotFoundException('Loan Option not found');
//       loan.loanOption = loanOption;
//     }

//     Object.assign(loan, dto);
//     const updated = await this.loanRepo.save(loan);

//     return {
//       id: updated.id,
//       title: updated.title,
//       loanOption: updated.loanOption?.name || null,
//       type: updated.type,
//       loanAmount: updated.loanAmount,
//       startDate: updated.startDate,
//       endDate: updated.endDate,
//       reason: updated.reason,
//     };
//   }

//   async remove(id: number) {
//     const loan = await this.loanRepo.findOneBy({ id });
//     if (!loan) throw new NotFoundException('Loan record not found');
//     await this.loanRepo.remove(loan);
//     return { message: `Loan ID ${id} deleted successfully` };
//   }
// }
