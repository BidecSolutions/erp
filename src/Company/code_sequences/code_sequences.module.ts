import { Module } from '@nestjs/common';
import { CodeSequencesController } from './code_sequences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeSequence } from './entities/code_sequence.entity';
import { CodeSequencesService } from './code_sequences.service';

@Module({
  imports:[TypeOrmModule.forFeature([CodeSequence])],
  controllers: [CodeSequencesController],
  providers: [CodeSequencesService],

})
export class CodeSequencesModule {}
