import { Test, TestingModule } from '@nestjs/testing';
import { ProbationSettingService } from './probation-setting.service';

describe('ProbationSettingService', () => {
  let service: ProbationSettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProbationSettingService],
    }).compile();

    service = module.get<ProbationSettingService>(ProbationSettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
