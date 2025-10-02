import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


UseGuards(JwtAuthGuard)
@Controller('allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) { }

  @Post('create')
  create(@Body() dto: CreateAllowanceDto) {
    return this.allowanceService.create(dto);
  }

 @Get('list')
  findAll(@Query('status') status?: string) {
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return this.allowanceService.findAll(filterStatus);
  }

  @Get(':id/get')
  findOne(@Param('id') id: number) {
    return this.allowanceService.findOne(+id);
  }

  @Put(':id/update')
  update(@Param('id') id: number, @Body() dto: UpdateAllowanceDto) {
    return this.allowanceService.update(+id, dto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: number) {
    return this.allowanceService.remove(+id);
  }

      @Get('toogleStatus/:id')
        statusChange(@Param('id', ParseIntPipe) id: number){
          return this.allowanceService.statusUpdate(id);
        }
}
