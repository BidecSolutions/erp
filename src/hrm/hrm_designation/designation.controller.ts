import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { DesignationService } from "./designation.service";
import { CreateDesignationDto } from "./dto/create-designation.dto";
import { UpdateDesignationDto } from "./dto/update-designation.dto";

@UseGuards(JwtAuthGuard)
@Controller("designations")
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  // ✅ List all designations
  @Get("list")
  async findAll(@Req() req: any, @Query("filter") filter?: string) {
    const companyId = req["user"].company_id;
    const designations = await this.designationService.findAll(
      companyId,
      filter !== undefined ? Number(filter) : undefined
    );

    return {
      status: true,
      message: "Get All Designations",
      data: designations,
    };
  }

  // ✅ Get single designation by ID
  @Get(":id/get")
  async findOne(@Req() req: any, @Param("id", ParseIntPipe) id: number) {
    const companyId = req["user"].company_id;
    const designation = await this.designationService.findOne(id, companyId);
    return {
      status: true,
      message: `Get Designation with ID ${id}`,
      data: designation,
    };
  }

  // ✅ Create new designation
  @Post("create")
  async create(@Body() dto: CreateDesignationDto, @Req() req: any) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;

    const created = await this.designationService.create(dto, userId, companyId);

    return {
      status: true,
      message: "Designation Created Successfully!",
      data: created,
    };
  }

  // ✅ Update designation
  @Put(":id/update")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDesignationDto,
    @Req() req: any
  ) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;

    const updated = await this.designationService.update(id, dto, userId, companyId);

    return {
      status: true,
      message: "Designation Updated Successfully!",
      data: updated,
    };
  }

  // ✅ Toggle Status
  @Get("toggleStatus/:id")
  async toggleStatus(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    const companyId = req["user"].company_id;
    const result = await this.designationService.statusUpdate(id, companyId);
    return result;
  }
}
