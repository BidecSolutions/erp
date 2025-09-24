import { Test, TestingModule } from '@nestjs/testing';
import { DeductionOptionController } from './deduction-option.controller';

describe('DeductionOptionController', () => {
  let controller: DeductionOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeductionOptionController],
    }).compile();

    controller = module.get<DeductionOptionController>(DeductionOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
