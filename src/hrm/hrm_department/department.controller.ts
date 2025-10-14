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
  async findAll(@Req() req: any, @Query("filter") filter?: string) {
   const companyId = req["user"].company_id;
    const departments = await this.departmentService.findAll(
       companyId,
      filter !== undefined ? Number(filter) : undefined
    );

    return { status: true, message: "Get All Departments", data: departments };
  }

  @Get(":id/get")
  async findOne(@Req() req: Request, @Param("id", ParseIntPipe) id: number) {
      const companyId = req["user"].company_id;
    const department = await this.departmentService.findOne(id,companyId);
    return {
      status: true,
      message: `Get Department with ID ${id}`,
      data: department,
    };
  }

  @Post("create")
  async create(@Body() dto: CreateDepartmentDto, @Req() req: Request) {
     const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;
    const departments = await this.departmentService.create(dto,userId, companyId);
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
    const userData = req["user"];
    const userId = userData?.user?.id;
    const companyId = userData?.company_id;
    const dept = await this.departmentService.update(id, dto,userId, companyId);
    return {
      status: true,
      message: "Department Updated Successfully...!",
      data: dept,
    };
  }

  @Get("toogleStatus/:id")
  async toggleStatus( @Req() req: Request,@Param("id", ParseIntPipe) id: number) {
    const companyId = req["user"].company_id;
    const result = await this.departmentService.statusUpdate(id, companyId);
    return result;
  }
}
