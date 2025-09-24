import { Module } from '@nestjs/common';
import { PaysliptypeService } from './paysliptype.service';
import { PaysliptypeController } from './paysliptype.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paysliptype } from './paysliptype.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Paysliptype])],
  providers: [PaysliptypeService],
  controllers: [PaysliptypeController],
  exports: [PaysliptypeService]
})
export class PaysliptypeModule {}
