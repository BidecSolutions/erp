import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ChartOfAccountModule } from './chart-of-account/chart-of-account.module';
import { JournalEntryModule } from './journal-entry/journal-entry.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { accountsChartOfAccount } from './entity/chart-of-account.entity';
import { accountsFiscalYear } from './entity/fiscal-year.entity';
import { accountsJournalVoucher } from './entity/journal-voucher.entity';
import { accountsPaymentVoucher } from './entity/payment-voucher.entity';
import { accountsPaymentVoucherDetails } from './entity/payment-voucher-details.entity';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [ChartOfAccountModule, JournalEntryModule, TypeOrmModule.forFeature([
    accountsPaymentVoucher, accountsPaymentVoucherDetails,
    accountsChartOfAccount, accountsFiscalYear, accountsJournalVoucher])]
})
export class AccountModule { }
