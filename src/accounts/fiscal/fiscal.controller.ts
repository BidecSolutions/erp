import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { FiscalService } from './fiscal.service';
import { JwtBranchAuth } from 'src/auth/jwt-branch.guard';


@UseGuards(JwtBranchAuth)
@Controller('fiscal-year')
export class FiscalController {
    constructor(
        private readonly fiscalService: FiscalService
    ) { }

    @Post('create')
    create(@Body() data: any, @Req() req: Request) {
        const company_id = req['user'].company_id;
        const create = this.fiscalService.create(data, company_id);
        return create;
    }

    @Get('list')
    findAll(@Req() req: Request) {
        const company_id = req['user'].company_id;
        return this.fiscalService.findAll(company_id);
    }

    @Get('find/:id')
    async findOne(@Param('id') id: number, @Req() req: Request) {
        return this.fiscalService.findOne(id);
    }

    @Put('update/:id')
    async update(@Param('id') id: number, @Body() body: any, @Req() req: Request) {
        const company_id = req['user'].company_id;
        return this.fiscalService.update(id, body, company_id);
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: number, @Body() body: any, @Req() req: Request) {
        const company_id = req['user'].company_id;
        return this.fiscalService.softDelete(id, company_id);
    }
}
