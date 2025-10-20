import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ProbationSettingService } from "./probation-setting.service";
import { CreateProbationSettingDto } from "./dto/create-probation-setting.dto";
import { UpdateProbationSettingDto } from "./dto/update-probation-setting.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("probation-setting")
export class ProbationSettingController {
  constructor(private readonly probationService: ProbationSettingService) {}

  // // Create probation setting
  @Post("create")
  async create(@Body() dto: CreateProbationSettingDto, @Req() req: any) {
    const companyId = req.user.company_id;
       const userId = req["user"].user?.id;
    const created = await this.probationService.create(dto, companyId,userId);
    return {
      status: true,
      message: "Probation Setting Created Successfully",
      data: created,
    };
  }

  // // Get all settings for company (with optional status filter)
  @Get("list")
  async findAll(@Req() req: any, @Query("status") status?: string) {
    const companyId = req.user.company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const settings = await this.probationService.findAll(
      companyId,
      filterStatus
    );
    return {
      status: true,
      message: "Get All Probation Settings",
      data: settings,
    };
  }

  // // Get single probation setting
  @Get(":id/get")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const setting = await this.probationService.findOne(id);
    return {
      status: true,
      message: `Get Probation Setting with ID ${id}`,
      data: setting,
    };
  }

  // // Update probation setting
  @Put(":id/update")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateProbationSettingDto,
    @Req() req: any
  ) {
    const companyId = req.user.company_id;
           const userId = req["user"].user?.id;
    const updated = await this.probationService.update(id, dto, companyId,userId);
    return {
      status: true,
      message: "Probation Setting Updated Successfully",
      data: updated,
    };
  }

  // // Toggle probation setting status
  @Get("toogleStatus/:id")
  async statusChange(@Param("id", ParseIntPipe) id: number) {
    return this.probationService.statusUpdate(id);
  }
}
