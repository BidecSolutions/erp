import { Test, TestingModule } from '@nestjs/testing';
import { LeaveSetupService } from './leave-setup.service';

describe('LeaveSetupService', () => {
  let service: LeaveSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveSetupService],
    }).compile();

    service = module.get<LeaveSetupService>(LeaveSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
