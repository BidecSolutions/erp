import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyContributionDto } from './create-company-contribution.dto';

export class UpdateCompanyContributionDto extends PartialType(CreateCompanyContributionDto) {}
