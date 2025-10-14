import { Module } from '@nestjs/common';
import { ChartOfAccountController } from './chart-of-account.controller';
import { ChartOfAccountService } from './chart-of-account.service';

@Module({
  controllers: [ChartOfAccountController],
  providers: [ChartOfAccountService]
})
export class ChartOfAccountModule {}
