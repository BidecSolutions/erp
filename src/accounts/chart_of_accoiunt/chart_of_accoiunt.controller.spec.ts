import { Test, TestingModule } from '@nestjs/testing';
import { ChartOfAccoiuntController } from './chart_of_accoiunt.controller';

describe('ChartOfAccoiuntController', () => {
  let controller: ChartOfAccoiuntController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChartOfAccoiuntController],
    }).compile();

    controller = module.get<ChartOfAccoiuntController>(ChartOfAccoiuntController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
