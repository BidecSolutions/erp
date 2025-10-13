import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ChartOfAccountsService } from './chart-of-accounts.service';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chart-of-account.dto';

@Controller('chart-of-accounts')
export class ChartOfAccountsController {
    constructor(private readonly service: ChartOfAccountsService) { }

    @Post('create')
    create(@Body() dto: CreateChartOfAccountDto) {
        return this.service.create(dto);
    }

    @Get('findAll')
    findAll() {
        return this.service.findAll();
    }

    @Get('findBy/:id')
    findOne(@Param('id') id: number) {
        return this.service.findOne(+id);
    }

    @Put('updateBy/:id')
    update(@Param('id') id: number, @Body() dto: UpdateChartOfAccountDto) {
        return this.service.update(+id, dto);
    }

    @Get('toggleStatus/:id')
    toggleStatus(@Param('id', ParseIntPipe) id: number) {
        return this.service.toggleStatus(id);
    }

}
