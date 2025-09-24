import { Test, TestingModule } from '@nestjs/testing';
import { DeductionOptionService } from './deduction-option.service';

describe('DeductionOptionService', () => {
  let service: DeductionOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeductionOptionService],
    }).compile();

    service = module.get<DeductionOptionService>(DeductionOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
