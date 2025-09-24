import { Controller, Post, Get, Param, Delete, Body, Put } from '@nestjs/common';
import { CompanyContributionService } from './company-contribution.service';
import { CreateCompanyContributionDto } from './dto/create-company-contribution.dto';
import { UpdateCompanyContributionDto } from './dto/update-company-contribution.dto';

@Controller('company-contribution')
export class CompanyContributionController {
  constructor(private readonly contributionService: CompanyContributionService) {}

  @Post('create')
  create(@Body() dto: CreateCompanyContributionDto) {
    return this.contributionService.create(dto);
  }

  @Get('list')
  findAll() {
    return this.contributionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contributionService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCompanyContributionDto) {
    return this.contributionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.contributionService.remove(id);
  }
}
