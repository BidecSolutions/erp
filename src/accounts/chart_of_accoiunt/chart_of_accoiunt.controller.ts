import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ChartOfAccoiuntService } from './chart_of_accoiunt.service';
import { JwtBranchAuth } from 'src/auth/jwt-branch.guard';

@UseGuards(JwtBranchAuth)
@Controller('chart-of-account')
export class ChartOfAccoiuntController {
    constructor(private readonly chartService: ChartOfAccoiuntService) { }

    @Post('create')
    async create(@Body() data: any, @Req() req: Request) {
        const company_id = req['user'].company_id;
        return this.chartService.create(data, company_id);
    }

    @Get('list')
    async findAll(@Req() req: Request) {
        const company_id = req['user'].company_id;
        return this.chartService.findAll(company_id);
    }

    @Get('find/:id')
    async findOne(@Param('id') id: number) {
        return this.chartService.findOne(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: number, @Body() body: any, @Req() req: Request) {
        const company_id = req['user'].company_id;
        return this.chartService.update(id, body, company_id);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: number, @Req() req: Request) {
        const company_id = req['user'].company_id;
        return this.chartService.softDelete(id, company_id);
    }

}
