import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from 'src/procurement/product/product.service';
import { StockAdjustment } from 'src/procurement/stock_adjustment/entities/stock_adjustment.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { SalesOrderDetail } from 'src/sales/sales-order/entity/sales-order-detail.entity';
import { CreatePosDto } from './dto/create-pos.dto';
import { CustomerService } from 'src/Company/customers/customer.service';
import { Company } from 'src/Company/companies/company.entity';
import { Customer } from 'src/Company/customers/customer.entity';

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
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,
    ) { }

    async getAllProducts() {
        try {
            const result = await this.productService.findAll();
            return { success: true, message: 'Products retrieved successfully', data: result };
        } catch (error) {
            return { success: false, message: 'Failed to retrieve products' };
        }
    }

    async getAllCustomers() {
        try {
            const result = await this.customerService.findAll();
            return { success: true, message: 'Customers retrieved successfully', data: result };
        } catch (error) {
            return { success: false, message: 'Failed to retrieve customers' };
        }
    }

    async createOrder(dto: CreatePosDto) {
        // Validate company_id if provided
        // let company: Company | null = null;
        // if (dto.company_id) {
        //     company = await this.companyRepo.findOne({ where: { id: dto.company_id } });
        //     if (!company) {
        //         return { success: false, message: `Company ID ${dto.company_id} not found` };
        //     }
        // }

        // // Validate customer_id if provided
        // let customer: Customer | null = null;
        // if (dto.customer_id) {
        //     customer = await this.customerRepo.findOne({ where: { id: dto.customer_id } });
        //     if (!customer) {
        //         return { success: false, message: `Customer ID ${dto.customer_id} not found` };
        //     }
        // }

        // Step 1: Create SaleOrder
        const order = this.salesOrderRepo.create({
            ...dto,
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
                salesOrder: { id: savedOrder.id },//savedOrder.id
                product: { id: item.product_id },
                quantity: item.quantity,
                unit_price: item.unit_price,
            });
            await this.salesOrderDetailRepo.save(detail);
        }

        return { message: 'Order created successfully', order_id: savedOrder.id };
    }
}

