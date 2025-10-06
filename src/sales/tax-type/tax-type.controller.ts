import { Controller, Get, Post, Body, Param, Put, Patch, ParseIntPipe } from '@nestjs/common';
import { TaxTypeService } from './tax-type.service';
import { CreateTaxTypeDto, UpdateTaxTypeDto } from './dto/tax-type.dto';

@Controller('tax-types')
export class TaxTypeController {
  constructor(private readonly taxTypeService: TaxTypeService) {}

  // ---------------- CREATE ----------------
  @Post('store')
  async create(@Body() dto: CreateTaxTypeDto) {
    return this.taxTypeService.create(dto);
  }

  // ---------------- GET ALL ----------------
  @Get('list')
  async findAll() {
    return this.taxTypeService.findAll();
  }

  // ---------------- GET ONE ----------------
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.taxTypeService.findOne(Number(id));
  }

  // ---------------- UPDATE ----------------
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateTaxTypeDto) {
    return this.taxTypeService.update(Number(id), dto);
  }

    // ---------------- TOGGLE STATUS ----------------
    @Get('toogleStatus/:id')
      statusChange(@Param('id', ParseIntPipe) id: number) {
        return this.taxTypeService.statusUpdate(id);
      }
}