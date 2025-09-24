import { Test, TestingModule } from '@nestjs/testing';
import { BankDetail } from './bank-detail.entity';
import { BankDetailService } from './bank-details.service';
describe('BankDetailsService', () => {
  let service: BankDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankDetailService],
    }).compile();

    service = module.get<BankDetailService>(BankDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
