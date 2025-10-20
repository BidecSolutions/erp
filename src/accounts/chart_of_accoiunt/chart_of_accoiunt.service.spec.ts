import { Test, TestingModule } from '@nestjs/testing';
import { ChartOfAccoiuntService } from './chart_of_accoiunt.service';

describe('ChartOfAccoiuntService', () => {
  let service: ChartOfAccoiuntService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChartOfAccoiuntService],
    }).compile();

    service = module.get<ChartOfAccoiuntService>(ChartOfAccoiuntService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
