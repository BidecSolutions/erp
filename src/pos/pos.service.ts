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
import { Product } from 'src/procurement/product/entities/product.entity';
import { CustomerAccount } from 'src/Company/customers/customer.customer_account.entity';
import { Stock } from 'src/procurement/stock/entities/stock.entity';
import { CreateSalesReturnDto } from './dto/create-sales-return.dto';
import { SalesReturn } from './entities/sales-return.entity';
import { SalesReturnDetail } from './entities/sales-return-detail.entity';

@Injectable()
export class PosService {
    constructor(
        private readonly productService: ProductService,
        private readonly customerService: CustomerService,
        private readonly dataSource: DataSource,
        @InjectRepository(Stock)
        private readonly stockRepo: Repository<Stock>,
        @InjectRepository(SalesOrder)
        private readonly salesOrderRepo: Repository<SalesOrder>,
        @InjectRepository(SalesOrderDetail)
        private readonly salesOrderDetailRepo: Repository<SalesOrderDetail>,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,

        @InjectRepository(CustomerAccount)
        private readonly customerAccountRepo: Repository<CustomerAccount>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(Branch)
        private readonly branchRepo: Repository<Branch>,

    ) { }

    async getAllProducts() {
        try {
            const result = await this.productService.findAll();

            if (!result.success || !('data' in result)) {
                return { success: false, message: 'No products found' };
            }

            const { product } = result.data; // // Safe now

            const product_with_stock = await Promise.all(
                product.map(async (p) => {
                    const stock = await this.stockRepo.findOne({
                        where: { product: { id: p.id } },
                        select: { quantity_on_hand: true, id: true } // Select only necessary fields
                    });
                    return { ...p, stock };
                })
            );

            return { product_with_stock };

        } catch (error) {
            return { success: false, message: 'Failed to retrieve products', error };
        }
    }

    async getAllCustomers(company_id: number) {
        try {
            const result = await this.customerService.findAll(company_id);
            return { success: true, message: 'Customers retrieved successfully', data: result };
        } catch (error) {
            return { success: false, message: 'Failed to retrieve customers' };
        }
    }


    async createOrder(dto: CreatePosDto, user: any) {
        try {
            const company_id = user.company_id
            const user_id = user.user.id
            return await this.dataSource.transaction(async (manager) => {
                let totalAmount = 0;
                const stockMap = new Map<number, Stock>();
                const orderItems: any[] = []; // store item details for response

                // Step 1: Validate stock once & keep in map
                for (const item of dto.order_details) {
                    const stock = await manager.findOne(Stock, {
                        where: { product: { id: item.product_id } },
                    });

                    if (!stock || stock.quantity_on_hand < item.quantity) {
                        throw new Error(`Product ID ${item.product_id} is out of stock`);
                    }
                    stockMap.set(item.product_id, stock); // save for later
                }

                ///Get company info(for response)
                const company = await this.companyRepo.findOne({
                    where: { id: company_id },
                    select: ['id', 'company_logo_path', 'address_line1', 'phone', 'company_name'],
                });

                // Step 2: Create SaleOrder only after all stocks are valid
                let walkingCustomer: Customer | null = null;
                if (!dto.customer_id) {
                    walkingCustomer = await this.customerRepo
                        .createQueryBuilder('customer')
                        .andWhere('company_id = :id', { id: company_id })
                        .getOne();
                }

                const order = manager.create(SalesOrder, {
                    ...dto,
                    customer: { id: dto.customer_id ?? walkingCustomer?.id } as Customer,
                    order_date: new Date(),
                    total_amount: 0,
                    // Relations
                    company: company_id ? ({ id: company_id } as Company) : undefined,
                    branch: dto.branch_id ? ({ id: dto.branch_id } as Branch) : undefined,
                    // Direct column (not relation)
                    sales_person_id: user_id,

                });
                const savedOrder = await manager.save(order);

                // Step 3: Deduct stock & create SaleOrderDetails
                for (const item of dto.order_details) {
                    const stock = stockMap.get(item.product_id)!; // safe now
                    stock.quantity_on_hand -= item.quantity;
                    await manager.save(stock);


                    const product_price = await this.productRepo.findOne({
                        where: { id: item.product_id },
                        select: { unit_price: true, id: true, product_name: true },
                    });

                    const product_unit_price = product_price?.unit_price ?? 0;

                    const lineAmount = item.quantity * product_unit_price;
                    totalAmount += Math.round(lineAmount);

                    const detail = manager.create(SalesOrderDetail, {
                        salesOrder: { id: savedOrder.id },
                        product: { id: item.product_id },
                        quantity: item.quantity,
                        unit_price: product_unit_price,
                    });
                    await manager.save(detail);

                    // Push to order items for response
                    orderItems.push({
                        product: product_price?.product_name,
                        quantity: item.quantity,
                        unit_price: product_unit_price,
                        total: lineAmount,
                    });
                }

                // Step 4: Update total amount
                savedOrder.total_amount = totalAmount;
                await manager.save(savedOrder);
                if (dto.customer_id) {
                    console.log('Updating customer account for customer ID:', dto.customer_id);

                    const customerAccount = await this.customerAccountRepo.findOne({
                        where: { customer: { id: dto.customer_id } }
                    });

                    const customerAmountExist = customerAccount?.amount || 0;
                    let newAmount = customerAmountExist + totalAmount;

                    newAmount = Math.round(newAmount);

                    await this.customerAccountRepo.update(
                        { customer: { id: dto.customer_id } },
                        { amount: newAmount }
                    );
                }

                const branch = dto.branch_id
                    ? await this.branchRepo.findOne({
                        where: { id: dto.branch_id },
                        select: { branch_name: true },
                    })
                    : null;

                let customerName: string;

                if (!dto.customer_id) {
                    customerName = 'Walking Customer';
                } else {
                    const customer = await this.customerRepo
                        .createQueryBuilder('customer')
                        .select(['customer.customer_name'])
                        .where('customer.id = :id', { id: dto.customer_id })
                        .getOne();
                    customerName = customer?.customer_name ?? 'Walking Customer';
                }

                return {
                    success: true,
                    message: 'Order created successfully',
                    order_id: savedOrder.id,
                    order_no: savedOrder.order_no,
                    branch_name: branch?.branch_name ?? null,
                    customer_name: customerName,
                    company: {
                        name: company?.company_name,
                        logo: company?.company_logo_path,
                        address: company?.address_line1,
                        contact_no: company?.phone,
                    },
                    order_items: orderItems,
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

    async getInstantProducts() {
        try {
            const result = await this.productService.findInstantProduct();

            if (!result || result.length === 0) {
                return { success: false, message: 'No products found' };
            }
            const product_with_stock = await Promise.all(
                result.map(async (p) => {
                    const stock = await this.stockRepo.findOne({
                        where: { product: { id: p.id } },
                        select: { quantity_on_hand: true, id: true },
                    });
                    return { ...p, stock };
                })
            );

            return { success: true, data: product_with_stock };
        } catch (error) {
            return { success: false, message: 'Failed to retrieve instant products', error };
        }
    }

    async createSalesReturn(dto: CreateSalesReturnDto, user: any) {
        try {
            const company_id = user.company_id;
            const user_id = user.user.id;

            return await this.dataSource.transaction(async (manager) => {
                const salesOrder = await manager.findOne(SalesOrder, {
                    where: { id: dto.sales_order_id },
                    relations: ['customer', 'company', 'branch'],
                });

                if (!salesOrder) {
                    throw new Error('Invalid Sales Order');
                }

                const orderDetails = await manager.find(SalesOrderDetail, {
                    where: { salesOrder: { id: dto.sales_order_id } },
                    relations: ['product'],
                });

                if (!orderDetails.length) {
                    throw new Error('No items found in sales order');
                }

                let returnItems = dto.return_items || [];
                let totalReturnAmount = 0;

                // Handle full return
                if (dto.is_full_return) {
                    returnItems = orderDetails.map((d) => ({
                        product_id: d.product.id,
                        quantity: d.quantity,
                    }));
                }

                if (!dto.is_full_return && (!dto.return_items || dto.return_items.length === 0)) {
                    throw new Error('No return items provided for partial return');
                }

                // Validate & process return items
                for (const item of returnItems) {
                    const orderItem = orderDetails.find((od) => od.product.id === item.product_id);
                    if (!orderItem) throw new Error(`Product ID ${item.product_id} not found in order`);
                    if (item.quantity > orderItem.quantity)
                        throw new Error(`Return qty exceeds sold qty for product ${item.product_id}`);

                    // Update stock (increase)
                    const stock = await manager.findOne(Stock, {
                        where: { product: { id: item.product_id } },
                    });
                    if (!stock) throw new Error(`Stock not found for product ${item.product_id}`);

                    stock.quantity_on_hand += item.quantity;
                    await manager.save(stock);

                    const lineAmount = orderItem.unit_price * item.quantity;
                    totalReturnAmount += lineAmount;
                }

                // Save sales return record
                const salesReturn = manager.create(SalesReturn, {
                    return_no: `SR-${Date.now()}`,
                    salesOrder: { id: dto.sales_order_id },
                    total_return_amount: Math.round(totalReturnAmount),
                    company: { id: company_id },
                    branch: salesOrder.branch ? { id: salesOrder.branch.id } : undefined,
                    customer: salesOrder.customer ? { id: salesOrder.customer.id } : undefined,
                    return_date: new Date(),
                    created_by: { id: user_id }
                });

                const savedReturn = await manager.save(salesReturn);

                // Save sales return details
                for (const item of returnItems) {
                    const orderItem = orderDetails.find((od) => od.product.id === item.product_id)!;
                    const returnDetail = manager.create(SalesReturnDetail, {
                        salesReturn: { id: savedReturn.id },
                        product: { id: item.product_id },
                        quantity: item.quantity,
                        unit_price: orderItem.unit_price,
                        total: orderItem.unit_price * item.quantity,
                    });
                    await manager.save(returnDetail);
                }

                // Adjust customer account
                if (salesOrder.customer) {
                    const customerAccount = await this.customerAccountRepo.findOne({
                        where: { customer: { id: salesOrder.customer.id } },
                    });

                    if (customerAccount) {
                        const newAmount = Math.round(
                            (customerAccount.amount || 0) - totalReturnAmount
                        );

                        if (newAmount < 0) {
                            throw new Error(
                                `Invalid operation: customer's account balance cannot go negative.`
                            );
                        }
                        
                        await this.customerAccountRepo.update(
                            { customer: { id: salesOrder.customer.id } },
                            { amount: newAmount }
                        );
                    }
                }

                return {
                    success: true,
                    message: dto.is_full_return
                        ? 'Full sale returned successfully'
                        : 'Partial sale return processed successfully',
                    return_id: savedReturn.id,
                    sales_order_id: salesOrder.id,
                    total_return_amount: totalReturnAmount,
                };
            });
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to process sale return',
            };
        }
    }


}

