import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTypeController } from './notification-type.controller';

describe('NotificationTypeController', () => {
  let controller: NotificationTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationTypeController],
    }).compile();

    controller = module.get<NotificationTypeController>(NotificationTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
