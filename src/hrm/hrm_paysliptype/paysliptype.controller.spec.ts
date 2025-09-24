import { Test, TestingModule } from '@nestjs/testing';
import { PaysliptypeController } from './paysliptype.controller';

describe('PaysliptypeController', () => {
  let controller: PaysliptypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaysliptypeController],
    }).compile();

    controller = module.get<PaysliptypeController>(PaysliptypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
