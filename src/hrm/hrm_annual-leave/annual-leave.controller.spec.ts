import { Test, TestingModule } from '@nestjs/testing';
import { AnnualLeaveController } from './annual-leave.controller';

describe('LeaveSetupController', () => {
  let controller: AnnualLeaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnualLeaveController],
    }).compile();

    controller = module.get<AnnualLeaveController>(AnnualLeaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
