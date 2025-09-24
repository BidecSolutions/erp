import { Test, TestingModule } from '@nestjs/testing';
import { AllowanceOptionService } from './allowance-option.service';

describe('AllowanceOptionService', () => {
  let service: AllowanceOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AllowanceOptionService],
    }).compile();

    service = module.get<AllowanceOptionService>(AllowanceOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
