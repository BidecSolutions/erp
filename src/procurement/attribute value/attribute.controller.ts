import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AttributeValueService } from './attribute_value.service';
import { AttributeValueDto, UpdateAttributeValueDto } from './dto/attribute-value.dto';

@UseGuards(JwtAuthGuard)
@Controller('attribute-value')

export class AttributeValueController {
  constructor(private readonly attributVeValueService: AttributeValueService) { }

  @Post('store')
  create(@Body() dto: AttributeValueDto, @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.attributVeValueService.create(dto, companyId, userId);
  }

  @Get('list')
  findAll(@Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.attributVeValueService.findAll(companyId);
  }
  @Get(':id')
  findOne(@Param('id') id: string,
    @Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.attributVeValueService.findOne(+id,companyId);
  }

  @Patch(':id')
  update(@Param('id') id: string,
    @Body() dto: UpdateAttributeValueDto,

    @Req() req: Request) {
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;

    return this.attributVeValueService.update(+id, dto, userId, companyId);
  }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.attributVeValueService.statusUpdate(id);
  }

}
