import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankDetail } from './bank-detail.entity';
import { BankDetailController } from './bank-details.controller';
import { BankDetailService } from './bank-details.service';


@Module({
  imports: [TypeOrmModule.forFeature([BankDetail])],
  controllers: [BankDetailController],
  providers: [BankDetailService],
  exports: [BankDetailService],
})
export class BankDetailModule {}
