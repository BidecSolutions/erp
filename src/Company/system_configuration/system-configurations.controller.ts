import { Controller, Post, Get, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SystemConfigurationsService } from './system-configurations.service';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';

@Controller('system-configurations')
export class SystemConfigurationsController {
    constructor(private readonly configService: SystemConfigurationsService) { }

    @Post('create')
    create(@Body() dto: CreateSystemConfigurationDto) {
        return this.configService.create(dto);
    }

    @Get('findAll')
    findAll() {
        return this.configService.findAll();
    }

    @Get('findBy/:id')
    findOne(@Param('id') id: number) {
        return this.configService.findOne(id);
    }

    @Put('updateBy/:id')
    update(@Param('id') id: number, @Body() dto: UpdateSystemConfigurationDto) {
        return this.configService.update(id, dto);
    }

    @Get('toggleStatus/:id')
    toggleStatus(@Param('id', ParseIntPipe) id: number) {
        return this.configService.toggleStatus(id);
    }

}
