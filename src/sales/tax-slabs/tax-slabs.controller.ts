import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Put,
    Patch,
    ParseIntPipe,
} from '@nestjs/common';
//import { TaxSlabService } from './tax-slab.service';
import { CreateTaxSlabDto, UpdateTaxSlabDto } from './dto/tax-slabs.dto';
import { TaxSlabService } from './tax-slabs.service';

@Controller('tax-slabs')
export class TaxSlabsController {
    constructor(private readonly slabService: TaxSlabService) { }

    // ---------------- CREATE ----------------
    @Post('store')
    async create(@Body() dto: CreateTaxSlabDto) {
        return this.slabService.create(dto);
    }

    // ---------------- GET ALL ----------------
    @Get('list')
    async findAll() {
        return this.slabService.findAll();
    }

    // ---------------- GET ONE ----------------
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.slabService.findOne(+id);
    }

    // ---------------- UPDATE ----------------
    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateTaxSlabDto) {
        return this.slabService.update(+id, dto);
    }

    // ---------------- TOGGLE STATUS ----------------
    @Get('toogleStatus/:id')
    statusChange(@Param('id', ParseIntPipe) id: number) {
        return this.slabService.statusUpdate(id);
    }
}

