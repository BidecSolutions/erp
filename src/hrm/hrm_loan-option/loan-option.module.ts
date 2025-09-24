import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanOption } from './loan-option.entity';
import { LoanOptionController } from './loan-option.controller';
import { LoanOptionService } from './loan-option.service';



@Module({
  imports: [TypeOrmModule.forFeature([LoanOption])],
  controllers: [LoanOptionController],
  providers: [LoanOptionService],
})
export class LoanOptionModule {}
