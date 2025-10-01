import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductService } from 'src/procurement/product/product.service';
import { StockAdjustment } from 'src/procurement/stock_adjustment/entities/stock_adjustment.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { SalesOrderDetail } from 'src/sales/sales-order/entity/sales-order-detail.entity';
import { CreatePosDto } from './dto/create-pos.dto';
import { CustomerService } from 'src/Company/customers/customer.service';
import { Company } from 'src/Company/companies/company.entity';
import { Customer } from 'src/Company/customers/customer.entity';
import { Branch } from 'src/Company/branch/branch.entity';

@Injectable()
export class PosService {
    constructor(
        private readonly productService: ProductService,
        private readonly customerService: CustomerService,
        private readonly dataSource: DataSource,
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
        try {
            return await this.dataSource.transaction(async (manager) => {
                let totalAmount = 0;
                const stockMap = new Map<number, StockAdjustment>();

                // Step 1: Validate stock once & keep in map
                for (const item of dto.order_details) {
                    const stock = await manager.findOne(StockAdjustment, {
                        where: { product: { id: item.product_id } },
                    });

                    if (!stock || stock.quantity < item.quantity) {
                        throw new Error(`Product ID ${item.product_id} is out of stock`);
                    }

                    stockMap.set(item.product_id, stock); // save for later
                }

                // Step 2: Create SaleOrder only after all stocks are valid
                const order = manager.create(SalesOrder, {
                    ...dto,
                    order_date: new Date(),
                    total_amount: 0,

                    // Relations
                    company: dto.company_id ? ({ id: dto.company_id } as Company) : undefined,
                    customer: dto.customer_id ? ({ id: dto.customer_id } as Customer) : undefined,
                    branch: dto.branch_id ? ({ id: dto.branch_id } as Branch) : undefined,
                    // Direct column (not relation)
                    sales_person_id: dto.sale_person_id,
                });
                const savedOrder = await manager.save(order);

                // Step 3: Deduct stock & create SaleOrderDetails
                for (const item of dto.order_details) {
                    const stock = stockMap.get(item.product_id)!; // safe now
                    stock.quantity -= item.quantity;
                    await manager.save(stock);

                    const lineAmount = item.quantity * item.unit_price;
                    totalAmount += lineAmount;

                    const detail = manager.create(SalesOrderDetail, {
                        salesOrder: { id: savedOrder.id },
                        product: { id: item.product_id },
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                    });
                    await manager.save(detail);
                }

                // Step 4: Update total amount
                savedOrder.total_amount = totalAmount;
                await manager.save(savedOrder);

                return {
                    success: true,
                    message: 'Order created successfully',
                    order_id: savedOrder.id,
                    total_amount: totalAmount,
                };
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to create order',
            };
        }
    }
}

