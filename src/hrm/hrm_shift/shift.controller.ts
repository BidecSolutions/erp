import { Controller, Get, Post, Body, Param, Patch, Delete, Put, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


UseGuards(JwtAuthGuard)
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) { }

  @Post('create')
  create(@Body() dto: CreateShiftDto) {
    return this.shiftService.create(dto);
  }
  
 @Get('list')
  findAll(@Query('status') status?: string) {
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return this.shiftService.findAll(filterStatus);
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.shiftService.findOne(+id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateShiftDto) {
    return this.shiftService.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.shiftService.remove(+id);
  }

    @Get('toogleStatus/:id')
          statusChange(@Param('id', ParseIntPipe) id: number){
            return this.shiftService.statusUpdate(id);
          }
}
