import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ModuleTypeService } from './module_type.service';
import { CreateModuleTypeDto } from './dto/create-module_type.dto';
import { UpdateModuleTypeDto } from './dto/update-module_type.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('module-type')
export class ModuleTypeController {
  constructor(private readonly moduleTypeService: ModuleTypeService) {}

    @Post('store')
    create(@Body() dto: CreateModuleTypeDto) {
      return this.moduleTypeService.create(dto);
    }
  
     @Get('list')
     findAll(@Query('filter') filter?: string) {
       return this.moduleTypeService.findAll(
         filter !== undefined ? Number(filter) : undefined,
       );
     }
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.moduleTypeService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBrandDto: UpdateModuleTypeDto) {
      return this.moduleTypeService.update(+id, updateBrandDto);
    }
    @Get('toogleStatus/:id')
    statusChange(@Param('id', ParseIntPipe) id: number) {
      return this.moduleTypeService.statusUpdate(id);
    }
}
