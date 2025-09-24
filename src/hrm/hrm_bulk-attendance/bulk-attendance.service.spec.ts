import { Test, TestingModule } from '@nestjs/testing';
import { BulkAttendanceService } from './bulk-attendance.service';

describe('BulkAttendanceService', () => {
  let service: BulkAttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulkAttendanceService],
    }).compile();

    service = module.get<BulkAttendanceService>(BulkAttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
