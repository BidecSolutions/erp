import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from 'src/procurement/product/product.service';
import { CustomerService } from '../customers/customer.service';
import { StockAdjustment } from 'src/procurement/stock_adjustment/entities/stock_adjustment.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { SalesOrderDetail } from 'src/sales/sales-order/entity/sales-order-detail.entity';
import { CreatePosDto } from './dto/create-pos.dto';

@Injectable()
export class PosService {
constructor(
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
    @InjectRepository(StockAdjustment)
    private readonly stockRepo: Repository<StockAdjustment>,
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepo: Repository<SalesOrder>,
    @InjectRepository(SalesOrderDetail)
    private readonly salesOrderDetailRepo: Repository<SalesOrderDetail>,
) { }

async getAllProducts() {
    try {
        const result = await this.productService.findAll();
        return { success: true, message: 'Products retrieved successfully', data: result };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to retrieve products' };
    }
}

async getAllCustomers() {
    try {
        const result = await this.customerService.findAll();
        return { success: true, message: 'Customers retrieved successfully', data: result };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to retrieve customers' };
    }
}

async createOrder(dto: CreatePosDto) {
    // Step 1: Create SaleOrder
    const order = this.salesOrderRepo.create({
        ...dto,
        order_no: `SO-${Date.now()}`,
        order_date: new Date(),
    });
    const savedOrder = await this.salesOrderRepo.save(order);

    // Step 2: Validate stock & create SaleOrderDetails
    for (const item of dto.order_details) {
        const stock = await this.stockRepo.findOne({
            where: { product: { id: item.product_id } },
            relations: ['product'],
        });

        if (!stock || stock.quantity < item.quantity) {
            return {
                success: false, message:
                    `Product ID ${item.product_id} is out of stock`,
            };
        }

        // Deduct stock
        stock.quantity -= item.quantity;
        await this.stockRepo.save(stock);

        // Save SaleOrderDetail
        const detail = this.salesOrderDetailRepo.create({
            salesOrder: savedOrder,//savedOrder.id
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
        });
        await this.salesOrderDetailRepo.save(detail);
    }

    return { message: 'Order created successfully', order_id: savedOrder.id };
}
}

