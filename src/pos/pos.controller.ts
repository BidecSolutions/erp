import { Body, Controller, Get, HttpException, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service';
import { CreatePosDto } from './dto/create-pos.dto';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';
import { CreateSalesReturnDto } from './dto/create-sales-return.dto';

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
    async createOrder(@Body() createPosDto: CreatePosDto, @Req() req: any) {
        const user = req.user;
        return this.posService.createOrder(createPosDto, user);
    }

    @Get('instant')
    async getInstantProducts() {
        return await this.posService.getInstantProducts();
    }

    @Post('sales-return')
    async createSalesReturn(@Body() dto: CreateSalesReturnDto, @Req() req: any) {
        const user = req.user; // comes from JWT
        return await this.posService.createSalesReturn(dto, user);
    }


    @Get('products-summary/:order_no')
    async getProductsSummary(@Param('order_no') order_no: string) {
        try {
            const data = await this.posService.getProductsSummaryByOrderNo(order_no);

            return {
                success: true,
                message: 'Summary fetched successfully',
                data,
            };
        } catch (err) {
            return {
                success: false,
                message: err.message,
                data: err,
            };
        }
    }

    @Get('productsByVariant')
    async getCategoriesForPOS(@Req() req:Request) {
        const company_id = req['user'].company_id
        if (!company_id || isNaN(company_id)) {
            return { success: false, message: 'company_id query parameter is required and must be an integer' };
        }
        const result = await this.posService.getCategoriesWithProductsForPOS(company_id);
        return result;
    }
}
