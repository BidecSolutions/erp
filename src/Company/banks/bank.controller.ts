import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';

@Controller('banks')
export class BankController {
    constructor(private readonly bankService: BankService) { }

    @Post('create')
    create(@Body() dto: CreateBankDto) {
        return this.bankService.create(dto);
    }

    @Get('findAll')
    findAll() {
        return this.bankService.findAll();
    }

    @Get('findby/:id')
    findOne(@Param('id') id: number) {
        return this.bankService.findOne(+id);
    }

    @Put('updateby/:id')
    update(@Param('id') id: number, @Body() dto: UpdateBankDto) {
        return this.bankService.update(+id, dto);
    }

    @Get('toggleStatus/:id')
    toggleStatus(@Param('id', ParseIntPipe) id: number) {
        return this.bankService.toggleStatus(id);
    }

}
