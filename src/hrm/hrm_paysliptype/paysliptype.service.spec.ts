import { Test, TestingModule } from '@nestjs/testing';
import { PaysliptypeService } from './paysliptype.service';

describe('PaysliptypeService', () => {
  let service: PaysliptypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaysliptypeService],
    }).compile();

    service = module.get<PaysliptypeService>(PaysliptypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
