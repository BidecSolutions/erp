import { Test, TestingModule } from '@nestjs/testing';
import { CodeSequencesService } from './code_sequences.service';

describe('CodeSequencesService', () => {
  let service: CodeSequencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeSequencesService],
    }).compile();

    service = module.get<CodeSequencesService>(CodeSequencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
