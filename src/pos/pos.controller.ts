import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PosService } from './pos.service';
import { CreatePosDto } from './dto/create-pos.dto';

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
    async createOrder(@Body() createPosDto: CreatePosDto) {
        //  const userId = req.user.id;
        return this.posService.createOrder(createPosDto);
    }

    @Get('instant')
    async getInstantProducts() {
        return await this.posService.getInstantProducts();
    }
}
