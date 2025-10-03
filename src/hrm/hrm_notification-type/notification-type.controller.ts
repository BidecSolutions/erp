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
import { NotificationTypeService } from './notification-type.service';
import { CreateNotificationTypeDto } from './dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from './dto/update-notification-type.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notification-type')
export class NotificationTypeController {
  constructor(private readonly service: NotificationTypeService) {}

  // Create notification type
  @Post('create')
  async create(@Body() dto: CreateNotificationTypeDto, @Req() req: any) {
    const companyId = req.user.company_id;
    const types = await this.service.create(dto, companyId);
    return {
      status: true,
      message: 'Notification Type Created Successfully',
      data: types,
    };
  }

  // Get all notification types for company with optional status filter
  @Get('list')
  async findAll(@Req() req: any, @Query('status') status?: string) {
    const companyId = req.user.company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const types = await this.service.findAll(companyId, filterStatus);
    return {
      status: true,
      message: 'Get All Notification Types',
      data: types,
    };
  }

  // Get single notification type by ID
  @Get(':id/get')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const type = await this.service.findOne(id);
    return {
      status: true,
      message: `Get Notification Type with ID ${id}`,
      data: type,
    };
  }

  // Update notification type
  @Put(':id/update')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationTypeDto,
    @Req() req: any,
  ) {
    const companyId = req.user.company_id;
    const updated = await this.service.update(id, dto, companyId);
    return {
      status: true,
      message: 'Notification Type Updated Successfully',
      data: updated,
    };
  }

  // Toggle status
  @Get('toogleStatus/:id')
  async statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.service.statusUpdate(id);
  }


}
