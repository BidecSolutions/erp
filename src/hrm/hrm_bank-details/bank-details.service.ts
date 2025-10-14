import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankDetail } from './bank-detail.entity';
import { UpdateBankDetailDto } from './dto/update-bank-details.dto';

@Injectable()
export class BankDetailService {
  constructor(
    @InjectRepository(BankDetail)
    private readonly bankRepo: Repository<BankDetail>,
  ) {}

  async createMany(employeeId: number, bankDetails: Partial<BankDetail>[]) {
    const banks = bankDetails.map((detail) =>
      this.bankRepo.create({
        ...detail,
        employeeId,
      }),
    );

    return this.bankRepo.save(banks);
  }

 
  
}
