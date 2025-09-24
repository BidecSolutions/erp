import { Test, TestingModule } from '@nestjs/testing';
import { AllowanceOptionController } from './allowance-option.controller';

describe('AllowanceOptionController', () => {
  let controller: AllowanceOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllowanceOptionController],
    }).compile();

    controller = module.get<AllowanceOptionController>(AllowanceOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
