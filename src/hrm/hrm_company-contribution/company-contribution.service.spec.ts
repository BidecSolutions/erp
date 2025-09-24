import { Test, TestingModule } from '@nestjs/testing';
import { CompanyContributionService } from './company-contribution.service';

describe('CompanyContributionService', () => {
  let service: CompanyContributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyContributionService],
    }).compile();

    service = module.get<CompanyContributionService>(CompanyContributionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
