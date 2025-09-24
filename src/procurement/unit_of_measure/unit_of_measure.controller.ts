import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UnitOfMeasureService } from './unit_of_measure.service';
import { CreateUnitOfMeasureDto } from './dto/create-unit_of_measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit_of_measure.dto';

@Controller('unit-of-measure')
export class UnitOfMeasureController {
  constructor(private readonly unitOfMeasureService: UnitOfMeasureService) {}

  @Post('store')
  create(@Body() createUnitOfMeasureDto: CreateUnitOfMeasureDto) {
    return this.unitOfMeasureService.create(createUnitOfMeasureDto);
  }

   @Get('list')
   findAll(@Query('filter') filter?: string) {
     return this.unitOfMeasureService.findAll(
       filter !== undefined ? Number(filter) : undefined,
     );
   }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitOfMeasureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnitOfMeasureDto: UpdateUnitOfMeasureDto) {
    return this.unitOfMeasureService.update(+id, updateUnitOfMeasureDto);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.unitOfMeasureService.statusUpdate(id);
  }

}
