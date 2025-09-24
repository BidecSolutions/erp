import { Test, TestingModule } from '@nestjs/testing';
import { CompanyContributionController } from './company-contribution.controller';

describe('CompanyContributionController', () => {
  let controller: CompanyContributionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyContributionController],
    }).compile();

    controller = module.get<CompanyContributionController>(CompanyContributionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
