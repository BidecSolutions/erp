import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProbationSettingService } from './probation-setting.service';
import { CreateProbationSettingDto } from './dto/create-probation-setting.dto';
import { UpdateProbationSettingDto } from './dto/update-probation-setting.dto';

@Controller('probation-setting')
export class ProbationSettingController {
  constructor(private readonly probationService: ProbationSettingService) {}

  @Post('create')
  async create(@Body() dto: CreateProbationSettingDto) {
    return this.probationService.create(dto);
  }

  @Get('list')
  findAll(@Query('status') status?: string) {
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return this.probationService.findAll(filterStatus);
  }

  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.probationService.findOne(id);
  }

  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProbationSettingDto,
  ) {
    return this.probationService.update(id, dto);
  }

  @Delete(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.probationService.remove(id);
  }

    @Get('toogleStatus/:id')
      statusChange(@Param('id', ParseIntPipe) id: number){
        return this.probationService.statusUpdate(id);
      }
}
