import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { CreateDepartmentDto } from "./dto/create-department.dto";
import { UpdateDepartmentDto } from "./dto/update-department.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("departments")
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get("list")
  async findAll(@Req() req: Request, @Query("status") status?: string) {
    const company = req["user"].company_id;
    const filterStatus = status !== undefined ? Number(status) : undefined;
    const departments = await this.departmentService.findAll(
      company,
      filterStatus,
    );

    return { status: true, message: "Get All Departments", data: departments };
  }

  @Get(":id/get")
async findOne(@Param("id", ParseIntPipe) id: number) {
  const department = await this.departmentService.findOne(id);
  return {
    status: true,
    message: `Get Department with ID ${id}`,
    data: department,
  };
}

  @Post("create")
  async create(@Body() dto: CreateDepartmentDto, @Req() req: Request) {
    const company = req["user"].company_id;
    const departments = await this.departmentService.create(dto, company);
    return {
      status: true,
      message: "Department Created Successfully...!",
      data: departments,
    };
  }

  @Put(":id/update")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
    @Req() req: Request
  ) {
    const company = req["user"].company_id;
    const dept = await this.departmentService.update(id, dto, company);
    return {
      status: true,
      message: "Department Updated Successfully...!",
      data: dept,
    };
  }

  @Get("toogleStatus/:id")
  statusChange(@Param("id", ParseIntPipe) id: number) {
    return this.departmentService.statusUpdate(id);
  }
}
