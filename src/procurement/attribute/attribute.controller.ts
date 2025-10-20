import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/create-attribute.dto';
import { AttributeService } from './attribute.service';


@UseGuards(JwtAuthGuard)
@Controller('attribute')

export class AttributeController {
  constructor(private readonly attributeService: AttributeService) { }

  @Post('store')
  create(@Body() dto: CreateAttributeDto, @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.attributeService.create(dto, companyId, userId);
  }

  @Get('list')
  findAll(@Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.attributeService.findAll(companyId);
  }
  @Get(':id')
  findOne(@Param('id') id: string,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.attributeService.findOne(+id,companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string,
    @Body() dto: UpdateAttributeDto,

    @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;

    return this.attributeService.update(+id, dto, userId, companyId);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.statusUpdate(id);
  }

}
