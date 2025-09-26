import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
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

    @Delete('deleteby/:id')
    remove(@Param('id') id: number) {
        return this.bankService.remove(+id);
    }
}
