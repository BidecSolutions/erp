import { Test, TestingModule } from '@nestjs/testing';
import { LoanOptionController } from './loan-option.controller';

describe('LoanOptionController', () => {
  let controller: LoanOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanOptionController],
    }).compile();

    controller = module.get<LoanOptionController>(LoanOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
