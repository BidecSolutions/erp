import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyContribution } from './company-contribution.entity';
import { CompanyContributionService } from './company-contribution.service';
import { CompanyContributionController } from './company-contribution.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyContribution])],
  providers: [CompanyContributionService],
  controllers: [CompanyContributionController],
})
export class CompanyContributionModule {}
