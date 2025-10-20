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
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';

@UseGuards(JwtEmployeeAuth)
@Controller('allowance')
export class AllowanceController {
  constructor(private readonly allowanceService: AllowanceService) { }

  // Create allowance
  @Post('create')
  async create(@Body() dto: CreateAllowanceDto, @Req() req: any) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;
    return await this.allowanceService.create(dto, userId, companyId);
  }

  // Get all allowances for company with optional status filter
  @Get('list')
  async findAll(@Req() req: any, @Query('filter') filter?: string) {
    const companyId = req["user"].company_id;
    return await this.allowanceService.findAll(
      companyId,
      filter !== undefined ? Number(filter) : undefined,
    );

  }

  // Get single allowance by ID
  @Get(':id/get')
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const companyId = req["user"].company_id;
    return await this.allowanceService.findOne(id, companyId);
  }

  // Update allowance
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAllowanceDto,
    @Req() req: any,
  ) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;
    return await this.allowanceService.update(id, dto, userId, companyId);

  }

  // Toggle allowance status
  @Get('toogleStatus/:id')
  async statusChange(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const companyId = req["user"].company_id;
    return this.allowanceService.statusUpdate(id, companyId);
  }

}
