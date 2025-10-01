import { Test, TestingModule } from '@nestjs/testing';
import { ProbationSettingController } from './probation-setting.controller';

describe('ProbationSettingController', () => {
  let controller: ProbationSettingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProbationSettingController],
    }).compile();

    controller = module.get<ProbationSettingController>(ProbationSettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
