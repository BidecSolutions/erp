import { Test, TestingModule } from '@nestjs/testing';
import { BulkAttendanceController } from './bulk-attendance.controller';

describe('BulkAttendanceController', () => {
  let controller: BulkAttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulkAttendanceController],
    }).compile();

    controller = module.get<BulkAttendanceController>(BulkAttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
