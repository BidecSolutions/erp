import { Test, TestingModule } from '@nestjs/testing';
import { LoanOptionService } from './loan-option.service';

describe('LoanOptionService', () => {
  let service: LoanOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanOptionService],
    }).compile();

    service = module.get<LoanOptionService>(LoanOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
