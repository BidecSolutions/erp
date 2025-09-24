import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { BankDetailService } from './bank-details.service';
import { UpdateBankDetailDto } from './dto/update-bank-details.dto';
import { BankDetail } from './bank-detail.entity';


@Controller('bank-details')
export class BankDetailController {
  constructor(private readonly bankDetailService: BankDetailService) {}

  @Post(':employeeId/create')
  async createBankDetails(
    @Param('employeeId') employeeId: number,
    @Body() bankDetails: Partial<BankDetail>[],
  ) {
    return this.bankDetailService.createMany(employeeId, bankDetails);
  }
  @Get(':employeeId/get')
  async getBankDetails(@Param('employeeId') employeeId: number) {
    return this.bankDetailService.findByEmployee(employeeId);
  }

}
