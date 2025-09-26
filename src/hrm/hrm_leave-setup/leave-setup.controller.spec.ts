import { Test, TestingModule } from '@nestjs/testing';
import { LeaveSetupController } from './leave-setup.controller';

describe('LeaveSetupController', () => {
  let controller: LeaveSetupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveSetupController],
    }).compile();

    controller = module.get<LeaveSetupController>(LeaveSetupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
