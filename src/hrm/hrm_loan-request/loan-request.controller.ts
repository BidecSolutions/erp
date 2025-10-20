import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  NotFoundException,
  Put,
  UseGuards,
} from "@nestjs/common";
import { LoanRequestService } from "./loan-request.service";
import { CreateLoanRequestDto } from "./dto/create-loan-request.dto";
import { UpdateLoanRequestDto } from "./dto/update-loan-request.dto";


import { JwtEmployeeAuth } from "src/auth/jwt-employee.guard";

@UseGuards(JwtEmployeeAuth)
@Controller("loan-request")
export class LoanRequestController {
  constructor(private readonly loanRequestService: LoanRequestService) { }

  @Post("create")
  create(@Body() dto: CreateLoanRequestDto) {
    return this.loanRequestService.create(dto);
  }


  @Get('list')
  findAll(@Query('status') status?: string) {
    //  query param se status ko number me convert kar rahe
    const filterStatus = status !== undefined ? Number(status) : undefined;
    return this.loanRequestService.findAll(filterStatus);
  }

  @Get(":id/get")
  findOne(@Param("id") id: number) {
    return this.loanRequestService.findOne(+id);
  }

  @Put(":id/update")
  update(@Param("id") id: number, @Body() dto: UpdateLoanRequestDto) {
    return this.loanRequestService.update(+id, dto);
  }

  // Approve loan request
  @Put(":id/approve")
  async approve(@Param("id", ParseIntPipe) id: number) {
    return this.loanRequestService.approveLoanRequest(id);
  }

  // Reject loan request with reason
  @Put(":id/reject")
  async reject(
    @Param("id", ParseIntPipe) id: number,
    @Body("reason") reason: string
  ) {
    return this.loanRequestService.rejectLoanRequest(id, reason);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.loanRequestService.statusUpdate(id);
  }
}
