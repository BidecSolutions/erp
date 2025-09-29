import { Controller, Post, Body, Param, Get, Put } from '@nestjs/common';
import { BankDetailService } from './bank-details.service';
import { UpdateBankDetailDto } from './dto/update-bank-details.dto';
import { BankDetail } from './bank-detail.entity';


@Controller('bank-details')
export class BankDetailController {
}
