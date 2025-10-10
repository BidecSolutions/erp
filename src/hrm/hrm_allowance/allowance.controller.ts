import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) { }

  // Create allowance
  @Post('create')
  async create(@Body() dto: CreateAllowanceDto, @Req() req: any) {
    const companyId = req["user"].company_id;
    const allowances = await this.allowanceService.create(dto, companyId);
    return {
      status: true,
      message: 'Allowance Created Successfully',
      data: allowances,
    };
  }

  // Get all allowances for company with optional status filter
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId = req["user"].company_id;
    const allowances = await this.allowanceService.findAll(companyId);
    return {
      status: true,
      message: 'Get All Allowances',
      data: allowances,
    };
  }

  // Get single allowance by ID
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const allowance = await this.allowanceService.findOne(id);
    return {
      status: true,
      message: `Get Allowance with ID ${id}`,
      data: allowance,
    };
  }

  // Update allowance
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAllowanceDto,
    @Req() req: any,
  ) {
    const companyId = req.user.company_id;
    const updated = await this.allowanceService.update(id, dto, companyId);
    return {
      status: true,
      message: 'Allowance Updated Successfully',
      data: updated,
    };
  }

  // Toggle allowance status
  @Get('toogleStatus/:id')
  async statusChange(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const companyId = req["user"].company_id;
    return this.allowanceService.statusUpdate(id, companyId);
  }

}
