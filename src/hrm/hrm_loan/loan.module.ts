// // loan.module.ts
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { LoanService } from './loan.service';
// import { LoanController } from './loan.controller';
// import { LoanOption } from '../hrm_loan-option/loan-option.entity';
// import { Loan } from './loan.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([Loan, LoanOption])], 
//   controllers: [LoanController],
//   providers: [LoanService],
//   exports: [LoanService],
// })
// export class LoanModule {}
