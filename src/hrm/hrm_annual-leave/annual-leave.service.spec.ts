import { Test, TestingModule } from '@nestjs/testing';
import { AnnualLeaveService } from './annual-leave.service';

describe('LeaveSetupService', () => {
  let service: AnnualLeaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnualLeaveService],
    }).compile();

    service = module.get<AnnualLeaveService>(AnnualLeaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
