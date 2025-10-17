import { Body, Controller, Get, HttpException, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service';
import { CreatePosDto } from './dto/create-pos.dto';
import { JwtEmployeeAuth } from 'src/auth/jwt-employee.guard';
import { CreateSalesReturnDto } from './dto/create-sales-return.dto';
import { CreateHoldOrderDto } from './dto/create-hold-order.dto';
import { CloseSessionDto, CreateSessionDto } from './dto/create-session.dto';

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
    async getCategoriesForPOS(@Req() req: Request) {
        const company_id = req['user'].company_id
        if (!company_id || isNaN(company_id)) {
            return { success: false, message: 'company_id query parameter is required and must be an integer' };
        }
        const result = await this.posService.getCategoriesWithProductsForPOS(company_id);
        return result;
    }

    @Post('hold-order')
    async createHoldOrder(@Body() dto: CreateHoldOrderDto, @Req() req: any) {
        const user = req.user ?? req;
        return await this.posService.createHoldOrder(dto, user);
    }

    @Get('list')
    async listHoldOrders(@Req() req) {
        const companyId = req['user'].company_id;
        const data = await this.posService.listHoldOrders(companyId);

        return {
            success: true,
            message: 'Hold orders fetched successfully',
            data: data,
        };
    }

    // Start session (enter opening balance)
    @Post('start-session')
    async startSession(@Req() req, @Body() dto: CreateSessionDto) {
        const userId = req['user'].user.id;
        const session = await this.posService.startSession(userId, dto.opening_balance, dto.branch_id);
        return { success: true, session };
    }

    // Close session
    @Post('close-session/:id')
    async closeSession(@Req() req, @Param('id') id: string, @Body() dto: CloseSessionDto) {
        try {
            const userId = req['user'].user.id;
            const session = await this.posService.closeSession(Number(id), userId, dto.closing_balance);
            return session;
        } catch (err) {
            return {
                success: false,
                message: err.message ?? 'Failed to close session',
            };
        }
    }

    // Get active session
    @Get('active-session')
    async activeSession(@Req() req) {
        const userId = req['user'].user.id;
        const session = await this.posService.getActiveSessionForEmployee(userId);
        return { active: !!session, session };
    }

    // POS controller (temporary test)
    @Get('test-active-session/:userId')
    async testActiveSession(@Param('userId') userId: string) {
        const session = await this.posService.getActiveSessionForEmployee(Number(userId));
        return { session };
    }

    @Get('test-requires-opening/:userId')
    async testRequiresOpening(@Param('userId') userId: string) {
        const requiresOpening = await this.posService.requiresOpeningBalance(Number(userId));
        return { requiresOpening };
    }


    @Get('findByBarcode/:barcode')
    async findByBarcode(@Param('barcode') barcode: string) {
        return this.posService.findByBarcode(barcode);
    }

}
