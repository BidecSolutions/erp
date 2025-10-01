import { Test, TestingModule } from '@nestjs/testing';
import { UnpaidLeaveController } from './unpaid-leave.controller';

describe('UnpaidLeaveController', () => {
  let controller: UnpaidLeaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnpaidLeaveController],
    }).compile();

    controller = module.get<UnpaidLeaveController>(UnpaidLeaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
