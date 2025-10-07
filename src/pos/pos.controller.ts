import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service';
import { CreatePosDto } from './dto/create-pos.dto';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';

@UseGuards(JwtEmployeeAuth)
@Controller('pos')
export class PosController {
    constructor(private readonly posService: PosService) { }


    @Get('products')
    async getAllProducts() {
        return this.posService.getAllProducts();
    }


@Get('customers')
async getAllCustomers(@Req() req) {
  const companyId = req.user.company_id;  // 👈 get company_id from JWT user
  return this.posService.getAllCustomers(companyId);
}

    @Post('create-order')
    async createOrder(@Body() createPosDto: CreatePosDto, @Req() req:any) {
           const user = req.user;
        return this.posService.createOrder(createPosDto, user);
    }

    @Get('instant')
    async getInstantProducts() {
        return await this.posService.getInstantProducts();
    }
}
