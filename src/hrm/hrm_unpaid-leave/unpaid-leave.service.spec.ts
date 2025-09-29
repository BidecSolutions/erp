import { Test, TestingModule } from '@nestjs/testing';
import { UnpaidLeaveService } from './unpaid-leave.service';

describe('UnpaidLeaveService', () => {
  let service: UnpaidLeaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnpaidLeaveService],
    }).compile();

    service = module.get<UnpaidLeaveService>(UnpaidLeaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
