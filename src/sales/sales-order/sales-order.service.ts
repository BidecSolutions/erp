import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Any } from 'typeorm';
import { SalesOrder } from './entity/sales-order.entity';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto/sales-order.dto';
import { errorResponse, successResponse, toggleStatusResponse } from 'src/commonHelper/response.util';
import { SalesOrderDetail } from './entity/sales-order-detail.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { Customer } from 'src/Company/customers/customer.entity';
import { Product } from 'src/procurement/product/entities/product.entity';
import { CreateSalesOrderDetailDto } from './dto/sales-order-detail.dto';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { Stock } from 'src/procurement/stock/entities/stock.entity';

@Injectable()
export class SalesOrderService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly orderRepo: Repository<SalesOrder>,
    private dataSource: DataSource,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(SalesOrderDetail)
    private readonly detailRepo: Repository<SalesOrderDetail>,

    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,

    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(productVariant)
    private readonly variantRepo: Repository<productVariant>,

    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,


    // @InjectRepository(SalesPerson)
    // private readonly salesPersonRepo: Repository<SalesPerson>,
  ) { }


// async store(createDto: CreateSalesOrderDto) {
//   try {
//     return await this.dataSource.transaction(async (manager) => {
//       const salesOrderRepo = manager.getRepository(SalesOrder);
//       const detailRepo = manager.getRepository(SalesOrderDetail);
//       const stockRepo = manager.getRepository(Stock);

//       // ---------------- CALCULATIONS ----------------
//       let subtotal = 0;

//       const salesOrderDetails: SalesOrderDetail[] = (createDto.salesOrderDetails ?? []).map(
        
//         (detailDto) => {

//           const line_total = detailDto.quantity * 23;
//           subtotal += line_total;


//           return detailRepo.create({
//             product_id: detailDto.product_id,
//             varient_id: detailDto.variant_id,
//             // description: detailDto.description,
//             unit_price: 12,
//             quantity: detailDto.quantity,
//             // discount_percent: detailDto.discount_percent ?? 0,
//             // tax_rate: detailDto.tax_rate ?? 0,
//             salesOrder: undefined, // will set after saving order
//           });
//         },
//       );

//       // ---------------- CREATE SALES ORDER ----------------
//       const order = salesOrderRepo.create({
//         order_no: createDto.order_no,
//         order_date: createDto.order_date,
//         expected_delivery_date: createDto.expected_delivery_date,
//         actual_delivery_date: createDto.actual_delivery_date,
//         order_priority: createDto.order_priority,
//         shipping_charges: createDto.shipping_charges ?? 0,
//         order_status: createDto.order_status,
//         delivery_status: createDto.delivery_status ?? 'pending',
//         payment_status: createDto.payment_status,
//         currency_code: createDto.currency_code,
//         exchange_rate: createDto.exchange_rate,
//         notes: createDto.notes,
//         terms_conditions: createDto.terms_conditions,
//         delivery_address: createDto.delivery_address,
//         company_id: createDto.company_id,
//         branch_id: createDto.branch_id,
//         customer_id: createDto.customer_id,
//         sales_person_id: createDto.sales_person_id,
//         sales_status: createDto.sales_status,
//         subtotal: subtotal,
//         total_amount: subtotal + (createDto.shipping_charges ?? 0), // can add tax/discount if needed
//       });

//       const savedOrder = await salesOrderRepo.save(order);

//       // ---------------- LINK DETAILS & SAVE ----------------
//       for (const detail of salesOrderDetails) {
//         detail.salesOrder = savedOrder; // link to saved order
//       }
//       const savedDetails = await detailRepo.save(salesOrderDetails);

//       return {
//         success: true,
//         message: 'Sales order created successfully!',
//         data: {
//           salesOrder: savedOrder,
//           salesOrderDetails: savedDetails,
//         },
//       };
//     });
//   } catch (error) {
//     if (error.code === 'ER_DUP_ENTRY') {
//       throw new BadRequestException('Sales order already exists');
//     }
//     throw new BadRequestException(error.message || 'Failed to create sales order');
//   }
// }

async store(createDto: CreateSalesOrderDto) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      const salesOrderRepo = manager.getRepository(SalesOrder);
      const detailRepo = manager.getRepository(SalesOrderDetail);
      const stockRepo = manager.getRepository(Stock); 

      

      let subtotal = 0;

      const salesOrderDetails: SalesOrderDetail[] = [];

      for (const detailDto of createDto.salesOrderDetails ?? []) {
      
        const stock = await stockRepo.findOne({
          where: {
            product_id: detailDto.product_id,
            variant_id: detailDto.variant_id,
          },
        });

      
        if (!stock || stock.quantity_on_hand < detailDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ID ${detailDto.product_id}, variant ID ${detailDto.variant_id}. Available: ${stock?.quantity_on_hand ?? 0}, Requested: ${detailDto.quantity}`,
          );
        }

      
        stock.quantity_on_hand -= detailDto.quantity;
        await stockRepo.save(stock);

       
        const line_total = detailDto.quantity * 12;
        subtotal += line_total;

     
        const orderDetail = detailRepo.create({
          product_id: detailDto.product_id,
          varient_id: detailDto.variant_id,
          unit_price: 12,
          quantity: detailDto.quantity,
          salesOrder: undefined,
        });

        salesOrderDetails.push(orderDetail);
      }

    
      const order = salesOrderRepo.create({
        order_no: createDto.order_no,
        order_date: createDto.order_date,
        expected_delivery_date: createDto.expected_delivery_date,
        actual_delivery_date: createDto.actual_delivery_date,
        order_priority: createDto.order_priority,
        shipping_charges: createDto.shipping_charges ?? 0,
        order_status: createDto.order_status,
        delivery_status: createDto.delivery_status ?? 'pending',
        payment_status: createDto.payment_status,
        currency_code: createDto.currency_code,
        exchange_rate: createDto.exchange_rate,
        notes: createDto.notes,
        terms_conditions: createDto.terms_conditions,
        delivery_address: createDto.delivery_address,
        company_id: createDto.company_id,
        branch_id: createDto.branch_id,
        customer_id: createDto.customer_id,
        sales_person_id: createDto.sales_person_id,
        sales_status: createDto.sales_status,
        subtotal,
        total_amount: subtotal + (createDto.shipping_charges ?? 0),
      });

      const savedOrder = await salesOrderRepo.save(order);

     
      for (const detail of salesOrderDetails) {
        detail.salesOrder = savedOrder;
      }
      const savedDetails = await detailRepo.save(salesOrderDetails);

      return successResponse('Sales order created successfully!', {
        salesOrder: savedOrder,
        salesOrderDetails: savedDetails,
      });
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException('Sales order already exists');
    }
    throw new BadRequestException(error.message || 'Failed to create sales order');
  }
}



  async findAll() {
    const orders = await this.orderRepo.find({
      relations: ['salesOrderDetails'],
      order: { id: 'DESC' },
    });

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return {
      success: true,
      message: 'Order fetched successfully',
      data: order,
    };
  }

// async update(id: number, updateDto: CreateSalesOrderDto) {
//   try {
//     return await this.dataSource.transaction(async (manager) => {
//       const salesOrderRepo = manager.getRepository(SalesOrder);
//       const detailRepo = manager.getRepository(SalesOrderDetail);
//       const stockRepo = manager.getRepository(Stock);

//       // 1️⃣ Check if order exists
//       const existingOrder = await salesOrderRepo.findOne({
//         where: { id },
//         relations: ['salesOrderDetails'],
//       });

//       if (!existingOrder) {
//         throw new BadRequestException('Sales order not found');
//       }

//       // 2️⃣ Restore stock from existing order
//       for (const oldDetail of existingOrder.salesOrderDetails ?? []) {
//         const stock = await stockRepo.findOne({
//           where: {
//             product_id: oldDetail.product_id,
//             variant_id: oldDetail.varient_id,
//           },
//         });

//         if (stock) {
//           stock.quantity_on_hand += oldDetail.quantity; // restore
//           await stockRepo.save(stock);
//         }
//       }

//       // 3️⃣ Remove existing details
//       await detailRepo.delete({ salesOrder: { id } });

//       // 4️⃣ Process new details
//       const salesOrderDetails: SalesOrderDetail[] = [];
//       let subtotal = 0;

//       for (const detailDto of updateDto.salesOrderDetails ?? []) {
//         // 🧾 Check stock availability
//         const stock = await stockRepo.findOne({
//           where: {
//             product_id: detailDto.product_id,
//             variant_id: detailDto.variant_id,
//           },
//         });

//         if (!stock || stock.quantity_on_hand < detailDto.quantity) {
//           throw new BadRequestException(
//             `Insufficient stock for product ID ${detailDto.product_id}, variant ID ${detailDto.variant_id}. Available: ${stock?.quantity_on_hand ?? 0}, Requested: ${detailDto.quantity}`,
//           );
//         }

//         // Deduct new quantities
//         stock.quantity_on_hand -= detailDto.quantity;
//         await stockRepo.save(stock);

//         const line_total = detailDto.quantity * 23;
//         subtotal += line_total;

//         const orderDetail = detailRepo.create({
//           product_id: detailDto.product_id,
//           varient_id: detailDto.variant_id,
//           unit_price: 12,
//           quantity: detailDto.quantity,
//           salesOrder: existingOrder,
//         });

//         salesOrderDetails.push(orderDetail);
//       }

//       // 5️⃣ Update main order
//       salesOrderRepo.merge(existingOrder, {
//         order_no: updateDto.order_no,
//         order_date: updateDto.order_date,
//         expected_delivery_date: updateDto.expected_delivery_date,
//         actual_delivery_date: updateDto.actual_delivery_date,
//         order_priority: updateDto.order_priority,
//         shipping_charges: updateDto.shipping_charges ?? 0,
//         order_status: updateDto.order_status,
//         delivery_status: updateDto.delivery_status ?? 'pending',
//         payment_status: updateDto.payment_status,
//         currency_code: updateDto.currency_code,
//         exchange_rate: updateDto.exchange_rate,
//         notes: updateDto.notes,
//         terms_conditions: updateDto.terms_conditions,
//         delivery_address: updateDto.delivery_address,
//         company_id: updateDto.company_id,
//         branch_id: updateDto.branch_id,
//         customer_id: updateDto.customer_id,
//         sales_person_id: updateDto.sales_person_id,
//         sales_status: updateDto.sales_status,
//         subtotal,
//         total_amount: subtotal + (updateDto.shipping_charges ?? 0),
//       });

//       const savedOrder = await salesOrderRepo.save(existingOrder);
//       const savedDetails = await detailRepo.save(salesOrderDetails);

//       return successResponse('Sales order updated successfully!', {
//         salesOrder: savedOrder,
//         salesOrderDetails: savedDetails,
//       });
//     });
//   } catch (error) {
//     throw new BadRequestException(error.message || 'Failed to update sales order');
//   }
// }  

async update(id: number, updateDto: CreateSalesOrderDto) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      const salesOrderRepo = manager.getRepository(SalesOrder);
      const detailRepo = manager.getRepository(SalesOrderDetail);
      const stockRepo = manager.getRepository(Stock);

      // 1️⃣ Load existing order with details
      const existingOrder = await salesOrderRepo.findOne({
        where: { id },
        relations: ['salesOrderDetails'],
      });

      if (!existingOrder) {
        throw new BadRequestException('Sales order not found');
      }

      const existingDetails = existingOrder.salesOrderDetails ?? [];

      // 2️⃣ Restore stock from previous details
      for (const oldDetail of existingDetails) {
        const stock = await stockRepo.findOne({
          where: {
            product_id: oldDetail.product_id,
            variant_id: oldDetail.varient_id,
          },
        });
        if (stock) {
          stock.quantity_on_hand += oldDetail.quantity;
          await stockRepo.save(stock);
        }
      }

      // 3️⃣ Process updated detail list
      let subtotal = 0;
      const processedDetails: SalesOrderDetail[] = [];

      for (const detailDtoRaw of updateDto.salesOrderDetails ?? []) {
        const detailDto: any = detailDtoRaw;
        const incomingVarientId = detailDto.varient_id ?? detailDto.variant_id;
        const incomingProductId = detailDto.product_id;

        // Declare properly typed variable
        let existingDetail: SalesOrderDetail | undefined = undefined;

        // Prefer match by ID if provided
        if (detailDto.id) {
          existingDetail = existingDetails.find((d) => d.id === detailDto.id);
        }
        // Otherwise match by product + variant
        if (!existingDetail) {
          existingDetail = existingDetails.find(
            (d) =>
              d.product_id === incomingProductId &&
              d.varient_id === incomingVarientId,
          );
        }

        // 3.a) Check stock
        const stock = await stockRepo.findOne({
          where: {
            product_id: incomingProductId,
            variant_id: incomingVarientId,
          },
        });

        if (!stock || stock.quantity_on_hand < detailDto.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ID ${incomingProductId}, variant ID ${incomingVarientId}. Available: ${stock?.quantity_on_hand ?? 0}, Requested: ${detailDto.quantity}`,
          );
        }

        // Deduct stock
        stock.quantity_on_hand -= detailDto.quantity;
        await stockRepo.save(stock);

        const unitPrice = (detailDto as any).unit_price ?? 12;
        const line_total = detailDto.quantity * unitPrice;
        subtotal += line_total;

        if (existingDetail) {
          // ✅ Update existing
          detailRepo.merge(existingDetail, {
            quantity: detailDto.quantity,
            unit_price: unitPrice,
          });
          const saved: SalesOrderDetail = await detailRepo.save(existingDetail);
          processedDetails.push(saved);
        } else {
          // ➕ Add new
          const newDetail = detailRepo.create({
            product_id: incomingProductId,
            varient_id: incomingVarientId,
            unit_price: unitPrice,
            quantity: detailDto.quantity,
            salesOrder: existingOrder,
          });
          const saved: SalesOrderDetail = await detailRepo.save(newDetail);
          processedDetails.push(saved);
        }
      }

      // 4️⃣ Remove deleted rows
      const incomingKeys = (updateDto.salesOrderDetails ?? []).map((d: any) => {
        const v = d.varient_id ?? d.variant_id;
        return `${d.product_id}-${v}`;
      });

      for (const oldDetail of existingDetails) {
        const key = `${oldDetail.product_id}-${oldDetail.varient_id}`;
        if (!incomingKeys.includes(key)) {
          await detailRepo.remove(oldDetail);
        }
      }

      // 5️⃣ Update main Sales Order
      salesOrderRepo.merge(existingOrder, {
        order_no: updateDto.order_no,
        order_date: updateDto.order_date,
        expected_delivery_date: updateDto.expected_delivery_date,
        actual_delivery_date: updateDto.actual_delivery_date,
        order_priority: updateDto.order_priority,
        shipping_charges: updateDto.shipping_charges ?? 0,
        order_status: updateDto.order_status,
        delivery_status: updateDto.delivery_status ?? 'pending',
        payment_status: updateDto.payment_status,
        currency_code: updateDto.currency_code,
        exchange_rate: updateDto.exchange_rate,
        notes: updateDto.notes,
        terms_conditions: updateDto.terms_conditions,
        delivery_address: updateDto.delivery_address,
        company_id: updateDto.company_id,
        branch_id: updateDto.branch_id,
        customer_id: updateDto.customer_id,
        sales_person_id: updateDto.sales_person_id,
        sales_status: updateDto.sales_status,
        subtotal,
        total_amount: subtotal + (updateDto.shipping_charges ?? 0),
      });

      const savedOrder = await salesOrderRepo.save(existingOrder);

      return successResponse('Sales order updated successfully!', {
        salesOrder: savedOrder,
        salesOrderDetails: processedDetails,
      });
    });
  } catch (error) {
    throw new BadRequestException(error.message || 'Failed to update sales order');
  }
}



  async statusUpdate(id: number) {
    try {
      const sale_order = await this.orderRepo.findOne({ where: { id } });
      if (!sale_order) throw new NotFoundException('sale_order not found');

      sale_order.status = sale_order.status === 0 ? 1 : 0;
      const saved = await this.orderRepo.save(sale_order);

      return toggleStatusResponse('sale order', saved.status);
    } catch (err) {
      return errorResponse('Something went wrong', err.message);
    }
  }
}
