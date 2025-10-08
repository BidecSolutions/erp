import { Module } from '@nestjs/common';
import { CodeSequencesController } from './code_sequences.controller';
import { CodeSequencesService } from '../code_sequences/code_sequences.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeSequence } from './entities/code_sequence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeSequence])],
  controllers: [CodeSequencesController],
  providers: [CodeSequencesService],

})
export class CodeSequencesModule { }
