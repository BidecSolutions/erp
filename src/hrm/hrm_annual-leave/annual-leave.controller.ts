import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  Req,
} from "@nestjs/common";
import { AnnualLeaveService } from "./annual-leave.service";
import { CreateAnnualLeaveDto } from "./dto/create-annual-leave.dto";
import { UpdateAnnualLeaveDto } from "./dto/update-annual-leave.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { JwtEmployeeAuth } from "src/auth/jwt-employee.guard";

@UseGuards(JwtEmployeeAuth)
@Controller("annual-leave")
export class AnnualLeaveController {
  constructor(private readonly annualLeaveService: AnnualLeaveService) { }

  @Post("create")
  async create(@Body() dto: CreateAnnualLeaveDto, @Req() req: any) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;
    const leaves = await this.annualLeaveService.create(dto, userId, companyId);
    return {
      status: true,
      message: "Annual Leave Created Successfully",
      data: leaves,
    };
  }

  @Get("list")
  async findAll(@Req() req: any, @Query("filter") filter?: string) {
    const companyId = req["user"].company_id;
    const leaves = await this.annualLeaveService.findAll(
      companyId,
      filter !== undefined ? Number(filter) : undefined
    );
    return { status: true, message: "Get All Annual Leaves", data: leaves };
  }

  @Get(":id/get")
  async findOne(@Req() req: Request, @Param("id", ParseIntPipe) id: number) {
    const companyId = req["user"].company_id;
    const leave = await this.annualLeaveService.findOne(id, companyId);
    return {
      status: true,
      message: `Get Annual Leave with ID ${id}`,
      data: leave,
    };
  }

  @Put(":id/update")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAnnualLeaveDto,
    @Req() req: any
  ) {
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;
    const updated = await this.annualLeaveService.update(
      id,
      dto,
      userId,
      companyId
    );
    return {
      status: true,
      message: "Annual Leave Updated Successfully",
      data: updated,
    };
  }

  @Get("toogleStatus/:id")
  async statusChange(@Param("id", ParseIntPipe) id: number) {
    return this.annualLeaveService.statusUpdate(id);
  }
}
