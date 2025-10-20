import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { generateCode } from 'src/commonHelper/response.util';
import { Category } from 'src/procurement/categories/entities/category.entity';
import { HoldOrder, HoldStatus } from './entities/hold-order.entity';
import { HoldOrderDetail } from './entities/hold-order-detail.entity';
import { CreateHoldOrderDto } from './dto/create-hold-order.dto';
import { CashRegisterSession, CashRegisterStatus } from './entities/cash-register-session.entity';

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

        @InjectRepository(Category)
        private readonly productCategory: Repository<Category>,

        @InjectRepository(CustomerAccount)
        private readonly customerAccountRepo: Repository<CustomerAccount>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(Branch)
        private readonly branchRepo: Repository<Branch>,
        @InjectRepository(productVariant)
        private readonly productVariantRepo: Repository<productVariant>,
        @InjectRepository(SalesReturn)
        private readonly salesReturnRepo: Repository<SalesReturn>,
        @InjectRepository(SalesReturnDetail)
        private readonly salesReturnDetailRepo: Repository<SalesReturnDetail>,
        @InjectRepository(HoldOrder)
        private holdOrderRepo: Repository<HoldOrder>,
        @InjectRepository(HoldOrderDetail)
        private holdOrderDetailRepo: Repository<HoldOrderDetail>,
        @InjectRepository(CashRegisterSession)
        private readonly repo: Repository<CashRegisterSession>,

    ) { }

    async getAllProducts(companyId: number) {
        try {
            const result = await this.productService.findAll(companyId);

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
            const company_id = user.company_id;
            const user_id = user.user.id;

            return await this.dataSource.transaction(async (manager) => {
                let totalAmount = 0;
                const stockMap = new Map<number, Stock>();
                const orderItems: any[] = [];

                // Step 1: Validate stock once & keep in map
                for (const item of dto.order_details) {
                    // 1.1 Get product & check variant requirement
                    const product = await this.productRepo.findOne({
                        where: { id: item.product_id },
                        select: ['id', 'has_variant', 'product_name', 'unit_price'],
                    });

                    if (!product) throw new Error(`Product ID ${item.product_id} not found`);

                    let variant: productVariant | null = null;

                    if (product && product.has_variant > 0) {
                        // Variant required
                        if (!item.variant_id) {
                            throw new Error(
                                `Variant ID is required for product ID ${item.product_id}`
                            );
                        }

                        // Get variant
                        variant = await this.productVariantRepo.findOne({
                            where: { id: item.variant_id, product: { id: item.product_id } },
                            select: ['id', 'variant_name', 'unit_price'],
                        });

                        if (!variant) {
                            throw new Error(
                                `Variant ID ${item.variant_id} not found for product ID ${item.product_id}`
                            );
                        }

                        // Find stock by variant_id
                        const stock = await manager.findOne(Stock, {
                            where: { variant: { id: variant.id } },
                        });

                        if (!stock || stock.quantity_on_hand < item.quantity) {
                            throw new Error(
                                `Variant ID ${variant.id} of product ${item.product_id} is out of stock`
                            );
                        }

                        stockMap.set(item.variant_id, stock);
                    } else {
                        // Normal product (no variant)
                        const stock = await manager.findOne(Stock, {
                            where: { product: { id: item.product_id } },
                        });

                        if (!stock || stock.quantity_on_hand < item.quantity) {
                            throw new Error(`Product ID ${item.product_id} is out of stock`);
                        }

                        stockMap.set(item.product_id, stock);
                    }
                }

                // Get company info for response
                const company = await this.companyRepo.findOne({
                    where: { id: company_id },
                    select: ['id', 'company_logo_path', 'address_line1', 'phone', 'company_name'],
                });

                // Step 2: Create SalesOrder
                let walkingCustomer: Customer | null = null;
                if (!dto.customer_id) {
                    walkingCustomer = await this.customerRepo
                        .createQueryBuilder('customer')
                        .andWhere('company_id = :id', { id: company_id })
                        .getOne();
                }

                // Generate order number
                const order_no = await generateCode('SALES_ORDER', 'SO', this.dataSource)
                const order = manager.create(SalesOrder, {
                    ...dto,
                    order_no,
                    customer: { id: dto.customer_id ?? walkingCustomer?.id } as Customer,
                    order_date: new Date(),
                    total_amount: 0,
                    company: company_id ? ({ id: company_id } as Company) : undefined,
                    branch: dto.branch_id ? ({ id: dto.branch_id } as Branch) : undefined,
                    sales_person_id: user_id,
                });
                const savedOrder = await manager.save(order);

                // Step 3: Deduct stock & create SaleOrderDetails
                for (const item of dto.order_details) {
                    const product = await this.productRepo.findOne({
                        where: { id: item.product_id },
                        select: ['id', 'has_variant', 'product_name', 'unit_price'],
                    });

                    let unitPrice = 0;
                    let displayName = '';
                    let detail: any;

                    if (product && product.has_variant > 0) {
                        const variant = await this.productVariantRepo.findOne({
                            where: {
                                id: item.variant_id,
                                product: { id: item.product_id },
                            },
                        });

                        if (item.variant_id === undefined) {
                            throw new Error(`variant_id is missing for product with variants`);
                        }
                        const stock = stockMap.get(item.variant_id)!;
                        stock.quantity_on_hand -= item.quantity;
                        await manager.save(stock);

                        unitPrice = variant?.unit_price ?? 0;
                        displayName = variant?.variant_name ?? 'Unknown Variant';

                        detail = manager.create(SalesOrderDetail, {
                            salesOrder: { id: savedOrder.id },
                            product: { id: item.product_id },
                            productVariant: variant || undefined,
                            quantity: item.quantity,
                            unit_price: unitPrice,
                        });
                    } else {
                        const stock = stockMap.get(item.product_id)!;
                        stock.quantity_on_hand -= item.quantity;
                        await manager.save(stock);

                        unitPrice = product?.unit_price ?? 0;
                        displayName = product?.product_name ?? 'Unknown Product';

                        detail = manager.create(SalesOrderDetail, {
                            salesOrder: { id: savedOrder.id },
                            product: { id: item.product_id },
                            quantity: item.quantity,
                            unit_price: unitPrice,
                        });
                    }

                    const lineAmount = item.quantity * unitPrice;
                    totalAmount += Math.round(lineAmount);

                    await manager.save(detail);

                    orderItems.push({
                        product: displayName,
                        quantity: item.quantity,
                        unit_price: unitPrice,
                        total: lineAmount,
                    });
                }

                // Step 4: Update total amount
                savedOrder.total_amount = totalAmount;
                await manager.save(savedOrder);

                if (dto.customer_id) {
                    const customerAccount = await this.customerAccountRepo.findOne({
                        where: { customer: { id: dto.customer_id } },
                    });

                    const currentBalance = customerAccount?.amount || 0;
                    const newAmount = Math.round(currentBalance + totalAmount);

                    await this.customerAccountRepo.update(
                        { customer: { id: dto.customer_id } },
                        { amount: newAmount }
                    );
                }

                // Get branch name
                const branch = dto.branch_id
                    ? await this.branchRepo.findOne({
                        where: { id: dto.branch_id },
                        select: { branch_name: true },
                    })
                    : null;

                // Get customer name
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
                    relations: ['product', 'productVariant'],
                });

                if (!orderDetails.length) {
                    throw new Error('No items found in sales order');
                }

                // Ensure return_items exist
                if (!dto.return_items || dto.return_items.length === 0) {
                    throw new Error('No return items provided');
                }

                // DUPLICATE CHECK HERE
                // const productIds = dto.return_items.map((i) => i.product_id);
                // const uniqueIds = new Set(productIds);
                // if (uniqueIds.size !== productIds.length) {
                //     throw new Error('Duplicate product IDs are not allowed in return items');
                // }
                // END DUPLICATE CHECK condition mujtaba here


                let totalReturnAmount = 0;


                // Validate & process return items
                for (const item of dto.return_items) {
                    if (!item.variant_id) {
                        throw new Error(`Variant ID is required for product ${item.product_id}`);
                    }
                    const orderItem = orderDetails.find((od) => od.product.id === item.product_id
                        &&
                        od.productVariant?.id === item.variant_id)!;
                    if (!orderItem) throw new Error(`Product ID ${item.product_id} not found in order`);


                    // Calculate remaining available for return
                    const alreadyReturned = orderItem.returned_quantity || 0;
                    const availableForReturn = orderItem.quantity - alreadyReturned;

                    // Validation: don't allow return greater than available qty
                    if (item.quantity > availableForReturn) {
                        throw new Error(
                            `Cannot return ${item.quantity}. Only ${availableForReturn} left for product ${item.product_id}`
                        );
                    }

                    // Update returned quantity
                    orderItem.returned_quantity += item.quantity;
                    await manager.save(orderItem);


                    // if (item.quantity > orderItem.quantity)
                    //     throw new Error(`Return qty exceeds sold qty for product ${item.product_id}`);

                    // NEW VALIDATION — prevent return if quantity would become 0 or below
                    const remainingQty = orderItem.quantity - item.quantity;
                    if (remainingQty < 0) {
                        throw new Error(
                            `Invalid return: product ID ${item.product_id} remaining quantity exceeds the remaining quantity`
                        );
                    }


                    // Update stock (increase)
                    const stock = await manager.findOne(Stock, {
                        where: {
                            product: { id: item.product_id },
                            variant: { id: item.variant_id },
                        },
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
                    created_by: user_id
                });

                const savedReturn = await manager.save(salesReturn);

                // Save sales return details
                for (const item of dto.return_items) {
                    const orderItem = orderDetails.find((od) => od.product.id === item.product_id)!;
                    const returnDetail = manager.create(SalesReturnDetail, {
                        salesReturn: { id: savedReturn.id },
                        product: { id: item.product_id },
                        productVariant: { id: item.variant_id },
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
                    message: 'Sale return processed successfully',
                    return_id: savedReturn.id,
                    sales_order_id: salesOrder.id,
                    sale_order_no: salesOrder.order_no,
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


    async getProductsSummaryByOrderNo(order_no: string) {
        // 1) find the order
        const order = await this.salesOrderRepo.findOne({ where: { order_no } });
        if (!order) {
            throw new NotFoundException(`Sales order with order_no ${order_no} not found`);
        }

        const orderId = (order as any).id;

        // 2) aggregated purchased quantities per product
        const purchasedRows: Array<{
            product_id: number;
            product_name: string | null;
            purchased_qty: string;
        }> = await this.salesOrderDetailRepo
            .createQueryBuilder('sod')
            .select('sod.product_id', 'product_id')
            .addSelect('p.product_name', 'product_name')
            .addSelect('sod.quantity', 'purchased_qty')
            .leftJoin('sod.product', 'p')
            .where('sod.order_id = :orderId', { orderId })
            .groupBy('sod.product_id')
            .addGroupBy('p.product_name')
            .getRawMany();

        // 3) aggregated return quantities per product
        const returnRows: Array<{
            product_id: number;
            return_qty: string;
        }> = await this.salesReturnDetailRepo
            .createQueryBuilder('srd')
            .select('srd.product_id', 'product_id')
            .addSelect('srd.quantity', 'return_qty')
            .innerJoin('srd.salesReturn', 'r')
            .where('r.sales_order_id = :orderId', { orderId })
            .groupBy('srd.product_id')
            .getRawMany();

        // 4) map returnRows
        const returnMap = new Map<number, number>();
        for (const r of returnRows) {
            const pid = Number(r.product_id);
            const qty = Number(r.return_qty ?? 0);
            returnMap.set(pid, qty);
        }

        // 5) build result from purchasedRows
        const results: Array<{
            product_id: number;
            product_name: string | null;
            purchased_qty: number;
            return_qty: number;
            current_qty: number;
        }> = [];

        const seenProductIds = new Set<number>();

        for (const p of purchasedRows) {
            const pid = Number(p.product_id);
            const purchasedQty = Number(p.purchased_qty ?? 0);
            const returnQty = returnMap.get(pid) ?? 0;
            const currentQty = returnQty === 0 ? 0 : purchasedQty - returnQty;

            results.push({
                product_id: pid,
                product_name: p.product_name ?? null,
                purchased_qty: purchasedQty,
                return_qty: returnQty,
                current_qty: currentQty,
            });

            seenProductIds.add(pid);
        }

        // 6) include products only in returns. It is exceptional case if database is consistent
        // for (const [pid, returnQty] of returnMap.entries()) {
        //     if (seenProductIds.has(pid)) continue;

        //     const product = await this.productRepo.findOne({ where: { id: pid } });
        //     const productName = product ? (product as any).product_name : null; 

        //     results.push({
        //         product_id: pid,
        //         product_name: productName,
        //         purchased_qty: 0,
        //         return_qty: returnQty,
        //         current_qty: 0 - returnQty,
        //     });
        // }

        return results;
    }


    async getCategoriesWithProductsForPOS(companyId: number) {
        // 1) Get categories
        const categories = await this.productCategory
            .createQueryBuilder('category')
            .select(['category.id as id', 'category.category_name as category_name'])
            .where('category.company_id = :companyId', { companyId })
            .getRawMany();

        // 2) For each category, fetch products
        const categoriesWithProducts = await Promise.all(
            categories.map(async (category) => {
                const products = await this.productRepo.find({
                    where: { category_id: category.id },
                    select: ['id', 'product_name', 'images'],
                });

                // 3) For each product, fetch variants
                const productsWithVariants = await Promise.all(
                    products.map(async (product) => {
                        //   const variants = await this.productVariantRepo.find({
                        //     where: { product: { id: product.id } },
                        //     select: ['id', 'variant_name'],
                        //   });

                        const variants = await this.productVariantRepo
                            .createQueryBuilder('variant')
                            .innerJoin('inventory_stock', 'stock', 'stock.variant_id = variant.id')
                            .select(['variant.id as id', 'variant.variant_name as variant_name', 'SUM(stock.quantity_on_hand) as total_stock'])
                            .where('variant.product_id = :productId', { productId: product.id })
                            .groupBy('variant.id')
                            .getRawMany();

                        const variantsWithImage = variants.map(v => ({
                            ...v,
                            image: null, // will replace when variant has image column
                        }));

                        return {
                            ...product,
                            variants: variantsWithImage,
                        };
                    })
                );

                return {
                    ...category,
                    products: productsWithVariants,
                };
            })
        );

        return categoriesWithProducts;
    }


    async createHoldOrder(dto: CreateHoldOrderDto, user: any) {
        try {
            const company_id = user.company_id;
            const user_id = user.user.id;

            // Generate hold_no before transaction
            const hold_no = await generateCode('Hold_order', 'Hold', this.dataSource);

            const customerId =
                dto.customer_id && Number(dto.customer_id) > 0
                    ? dto.customer_id
                    : 1;

            const result = await this.dataSource.transaction(async (manager) => {
                let totalAmount = 0;
                // Create base hold order entity
                const holdOrder = manager.create(HoldOrder, {
                    company_id: company_id ?? undefined,
                    branch_id: dto.branch_id,
                    customer_id: customerId,
                    sales_person_id: dto.sale_person_id,
                    hold_no,
                    order_date: new Date(),
                    total_amount: 0,
                    created_by: user_id,
                    hold_status: HoldStatus.HOLD,
                    status: 1,
                });

                const savedHold = await manager.save(holdOrder);

                // Loop details
                for (const item of dto.order_details) {
                    // 1) Basic validation: quantity must be > 0
                    if (!item.quantity || Number(item.quantity) <= 0) {
                        throw new Error(
                            `Invalid quantity for product_id ${item.product_id}. Quantity must be greater than 0.`,
                        );
                    }

                    // 2) Product existence
                    const product = await manager.findOne(Product, {
                        where: { id: item.product_id },
                        select: ['id', 'has_variant', 'product_name', 'unit_price'],
                    });

                    if (!product) {
                        throw new Error(`Product ID ${item.product_id} not found`);
                    }

                    // 3) Variant rules
                    let variantRecord: productVariant | null = null;
                    if (product.has_variant && Number(product.has_variant) > 0) {
                        // product expects variant_id
                        if (!item.variant_id) {
                            throw new Error(
                                `Variant ID is required for product ID ${item.product_id}`,
                            );
                        }

                        variantRecord = await manager.findOne(productVariant, {
                            where: { id: item.variant_id, product: { id: item.product_id } },
                            select: ['id', 'variant_name', 'unit_price'],
                        });

                        if (!variantRecord) {
                            throw new Error(
                                `Variant ID ${item.variant_id} not found for product ID ${item.product_id}`,
                            );
                        }
                    } else {
                        // product has no variant -> variant_id should not be provided (or can be ignored)
                        if (item.variant_id) {
                            // you requested strictness — treat this as an error
                            throw new Error(
                                `Product ID ${item.product_id} does not accept variants. Remove variant_id.`,
                            );
                        }
                    }


                    const unit_price =
                        item.unit_price ??
                        (variantRecord?.unit_price ?? product.unit_price ?? 0);
                    totalAmount += unit_price * Number(item.quantity);

                    // (Stock doesn't exist in your schema) — we still validate quantity > 0 above.
                    // If in future you have a stock table, add a check here.
                    let availableStock = 0;

                    if (variantRecord) {
                        // Product has variant -> check variant stock
                        const stock = await manager.findOne(Stock, {
                            where: {
                                product_id: item.product_id,
                                variant_id: variantRecord.id,
                                // branch_id: dto.branch_id,
                            },
                            select: ['quantity_on_hand'],
                        });
                        availableStock = stock?.quantity_on_hand ?? 0;
                    } else {
                        // Product has no variant -> check product stock (variant_id should be null)
                        const stock = await manager.findOne(Stock, {
                            where: {
                                product_id: item.product_id,
                                variant_id: undefined,
                                // branch_id: dto.branch_id,
                            },
                            select: ['quantity_on_hand'],
                        });
                        availableStock = stock?.quantity_on_hand ?? 0;
                    }

                    // Compare
                    if (Number(item.quantity) > availableStock) {
                        throw new Error(
                            `Not enough stock for product_id ${item.product_id}${variantRecord ? ` (variant_id ${variantRecord.id})` : ''
                            }. Requested: ${item.quantity}, Available: ${availableStock}`
                        );
                    }

                    // Prepare the hold order detail
                    const detail = manager.create(HoldOrderDetail, {
                        holdOrder: { id: savedHold.id } as HoldOrder,
                        product: { id: item.product_id } as Product,
                        productVariant: variantRecord ? ({ id: variantRecord.id } as productVariant) : undefined,
                        unit_price,
                        quantity: item.quantity,
                    });

                    await manager.save(detail);
                }

                savedHold.total_amount = totalAmount;
                await manager.save(savedHold);

                // Return saved hold (with basic info)
                return {
                    success: true,
                    message: 'Hold order created successfully',
                    hold_order_id: savedHold.id,
                    hold_no: savedHold.hold_no,
                    total_amount: totalAmount,
                };
            });

            return result;
        } catch (error) {
            return {
                success: false,
                message: error?.message ?? 'Failed to create hold order',
            };
        }
    }


    async listHoldOrders(companyId: number) {
        try {
            const holdOrders = await this.dataSource
                .getRepository(HoldOrder)
                .createQueryBuilder('ho')
                .leftJoin(HoldOrderDetail, 'hod', 'hod.hold_order_id = ho.id')
                .select([
                    'ho.id AS hold_order_id',
                    'ho.branch_id AS branch_id',
                    'ho.customer_id AS customer_id',
                    'hod.product_id AS product_id',
                    'hod.product_variant_id AS variant_id',
                    'hod.unit_price AS unit_price',
                    'hod.quantity AS quantity'
                ])
                .where('ho.company_id = :companyId', { companyId })
                // .andWhere('ho.status = :status', { status: 'HOLD' })
                .orderBy('ho.id', 'DESC')
                .getRawMany();


            // Group By hold_order_id
            const grouped = {};
            holdOrders.forEach(row => {
                if (!grouped[row.hold_order_id]) {
                    grouped[row.hold_order_id] = {
                        branch_id: row.branch_id,
                        customer_id: row.customer_id,
                        hold_order_id: row.hold_order_id,
                        order_details: [],
                        total_amount: 0,
                    };
                }

                if (row.product_id !== null) {
                    grouped[row.hold_order_id].order_details.push({
                        product_id: row.product_id,
                        variant_id: row.variant_id,
                        unit_price: row.unit_price,
                        quantity: row.quantity,
                    });

                    grouped[row.hold_order_id].total_amount += row.unit_price * row.quantity;
                }
            });

            return Object.values(grouped).sort((a, b) => {
                const holdA = a as { hold_order_id: number };
                const holdB = b as { hold_order_id: number };
                return holdB.hold_order_id - holdA.hold_order_id;
            });
        } catch (error) {
            console.log('ERROR =>', error);
            throw error;
        }
    }

    /** Return active OPEN session for employee (or null) */
    // Check if employee has active session
    async getActiveSessionForEmployee(userId: number) {
        return this.repo.findOne({
            where: { user_id: userId, status: CashRegisterStatus.OPEN },
        });
    }

    // Return flag: true = can continue POS, false = needs opening balance
    async requiresOpeningBalance(userId: number): Promise<boolean> {
        const active = await this.getActiveSessionForEmployee(userId);
        return !!active;
    }

    // Start session with opening balance
    async startSession(userId: number, opening_balance: number, branch_id?: number) {
        const existing = await this.getActiveSessionForEmployee(userId);
        if (existing) {
            throw new BadRequestException('You already have an active session.');
        }

        const session = this.repo.create({
            user_id: userId,
            branch_id: branch_id ?? undefined,
            opening_balance,
            start_date: new Date(),
            status: CashRegisterStatus.OPEN,
        });

        return this.repo.save(session);
    }


    async closeSession(sessionId: number, userId: number, closing_balance: number) {
        try {
            const session = await this.repo.findOne({ where: { id: sessionId } });
            if (!session) {
                throw new BadRequestException('Session not found');
            }


            if (session.user_id !== userId) {
                throw new BadRequestException('Cannot close this session');
            }

            if (session.status !== CashRegisterStatus.OPEN) {
                throw new BadRequestException('Session not open');
            }


            if (!session.start_date) {
                throw new BadRequestException('Session start date missing - cannot calculate totals');
            }


            const startDate = session.start_date;
            const endDate = new Date();


            const salesQuery = this.salesOrderRepo.createQueryBuilder('so')
                .select('COALESCE(SUM(so.total_amount), 0)', 'total')
                .where('so.sales_person_id = :userId', { userId })
                .andWhere('so.order_date BETWEEN :start AND :end', { start: startDate, end: endDate });

            if (session.branch_id) {
                salesQuery.andWhere('so.branch_id = :branchId', { branchId: session.branch_id });
            }

            const salesRow = await salesQuery.getRawOne();
            const totalSales = Number(salesRow?.total ?? 0);


            const returnsQuery = this.salesReturnRepo.createQueryBuilder('sr')
                .select('COALESCE(SUM(sr.total_return_amount), 0)', 'total')
                .where('sr.created_by = :userId', { userId })
                .andWhere('sr.return_date BETWEEN :start AND :end', { start: startDate, end: endDate });

            if (session.branch_id) {
                returnsQuery.andWhere('sr.branch_id = :branchId', { branchId: session.branch_id });
            }

            const returnsRow = await returnsQuery.getRawOne();
            const totalReturns = Number(returnsRow?.total ?? 0);

            const opening = Number(session.opening_balance ?? 0);
            const expected = Number((opening + totalSales - totalReturns).toFixed(2));
            const difference = Number((closing_balance - expected).toFixed(2));

          
            const saved = await this.dataSource.transaction(async (manager) => {
                const sess = await manager.findOne(CashRegisterSession, { where: { id: sessionId } });
                if (!sess) throw new BadRequestException('Session not found in transaction');

                
                sess.closing_balance = Number(closing_balance.toFixed ? closing_balance.toFixed(2) : closing_balance);
                sess.end_date = endDate;
                sess.status = CashRegisterStatus.CLOSED;

                
                (sess as any).total_sales = Number(totalSales.toFixed ? totalSales.toFixed(2) : totalSales);
                (sess as any).total_refunds = Number(totalReturns.toFixed ? totalReturns.toFixed(2) : totalReturns);
                (sess as any).expected_balance = expected;
                (sess as any).difference = difference;

                const updated = await manager.save(sess);
                return updated;
            });

            return {
                success: true,
                message: 'Session closed successfully',
                data: {
                    session_id: saved.id,
                    user_id: saved.user_id,
                    branch_id: saved.branch_id ?? null,
                    opening_balance: Number(opening.toFixed ? opening.toFixed(2) : opening),
                    total_sales: Number(totalSales.toFixed ? totalSales.toFixed(2) : totalSales),
                    total_returns: Number(totalReturns.toFixed ? totalReturns.toFixed(2) : totalReturns),
                    expected_balance: Number(expected.toFixed ? expected.toFixed(2) : expected),
                    closing_balance: Number(saved.closing_balance ?? closing_balance),
                    difference: Number(difference.toFixed ? difference.toFixed(2) : difference),
                    start_date: session.start_date,
                    end_date: saved.end_date,
                    status: saved.status,
                },
                //  session: saved,
            };
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException(error?.message ?? 'Failed to close session');
        }
    }

}

