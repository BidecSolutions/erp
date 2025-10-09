import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateCodeSequenceDto } from './dto/create-code_sequence.dto';
import { UpdateCodeSequenceDto } from './dto/update-code_sequence.dto';
import { CodeSequencesService } from './code_sequences.service';

@Controller('code-sequences')
export class CodeSequencesController {
  constructor(private readonly codeSequencesService: CodeSequencesService) {}

  @Post('store')
  create(@Body() createCodeSequenceDto: CreateCodeSequenceDto) {
    return this.codeSequencesService.create(createCodeSequenceDto);
  }

  @Get()
  findAll() {
    return this.codeSequencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codeSequencesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCodeSequenceDto: UpdateCodeSequenceDto) {
    return this.codeSequencesService.update(+id, updateCodeSequenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.codeSequencesService.remove(+id);
  }
}
