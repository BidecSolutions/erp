import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCodeSequenceDto } from './dto/create-code_sequence.dto';
import { UpdateCodeSequenceDto } from './dto/update-code_sequence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeSequence } from './entities/code_sequence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CodeSequencesService {
  constructor(
        @InjectRepository(CodeSequence)
          private readonly repo: Repository<CodeSequence>
){}
  
  async create(dto: CreateCodeSequenceDto) {
    // Check if module already exists
    const existing = await this.repo.findOne({ where: { module_name: dto.module_name } });
    if (existing) {
      throw new ConflictException(`Sequence for '${dto.module_name}' already exists`);
    }

    const sequence = this.repo.create({
      module_name: dto.module_name.toLowerCase(),
      prefix: dto.prefix.toUpperCase(),
      last_number: dto.last_number,
    });

    await this.repo.save(sequence);

    return {
      success: true,
      message: `Code sequence for '${dto.module_name}' created successfully`,
      data: sequence,
    };
  }


  findAll() {
    return `This action returns all codeSequences`;
  }

  findOne(id: number) {
    return `This action returns a #${id} codeSequence`;
  }

  update(id: number, updateCodeSequenceDto: UpdateCodeSequenceDto) {
    return `This action updates a #${id} codeSequence`;
  }

  remove(id: number) {
    return `This action removes a #${id} codeSequence`;
  }
}
