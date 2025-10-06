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

    // @InjectRepository(SalesPerson)
    // private readonly salesPersonRepo: Repository<SalesPerson>,
  ) { }


async store(createDto: CreateSalesOrderDto) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      const salesOrderRepo = manager.getRepository(SalesOrder);
      const detailRepo = manager.getRepository(SalesOrderDetail);

      // ---------------- CALCULATIONS ----------------
      let subtotal = 0;

      const salesOrderDetails: SalesOrderDetail[] = (createDto.salesOrderDetails ?? []).map(
        (detailDto) => {
          const line_total = detailDto.quantity * detailDto.unit_price;
          subtotal += line_total;

          return detailRepo.create({
            product_id: detailDto.product_id,
            description: detailDto.description,
            unit_price: detailDto.unit_price,
            quantity: detailDto.quantity,
            discount_percent: detailDto.discount_percent ?? 0,
            tax_rate: detailDto.tax_rate ?? 0,
            salesOrder: undefined, // will set after saving order
          });
        },
      );

      // ---------------- CREATE SALES ORDER ----------------
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
        subtotal: subtotal,
        total_amount: subtotal + (createDto.shipping_charges ?? 0), // can add tax/discount if needed
      });

      const savedOrder = await salesOrderRepo.save(order);

      // ---------------- LINK DETAILS & SAVE ----------------
      for (const detail of salesOrderDetails) {
        detail.salesOrder = savedOrder; // link to saved order
      }
      const savedDetails = await detailRepo.save(salesOrderDetails);

      return {
        success: true,
        message: 'Sales order created successfully!',
        data: {
          salesOrder: savedOrder,
          salesOrderDetails: savedDetails,
        },
      };
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

  async update(id: number, updateDto: CreateSalesOrderDto) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      const salesOrderRepo = manager.getRepository(SalesOrder);
      const detailRepo = manager.getRepository(SalesOrderDetail);

      // ----------- FIND EXISTING ORDER -----------
      const existingOrder = await salesOrderRepo.findOne({
        where: { id },
        relations: ['salesOrderDetails'],
      });

      if (!existingOrder) {
        throw new BadRequestException(`Sales order with ID ${id} not found`);
      }

      // ----------- REMOVE OLD DETAILS -----------
      if (existingOrder.salesOrderDetails?.length > 0) {
        await detailRepo.remove(existingOrder.salesOrderDetails);
      }

      // ----------- RECALCULATE SUBTOTAL -----------
      let subtotal = 0;
      const salesOrderDetails: SalesOrderDetail[] = (updateDto.salesOrderDetails ?? []).map(
        (detailDto) => {
          const line_total = detailDto.quantity * detailDto.unit_price;
          subtotal += line_total;

          return detailRepo.create({
            product_id: detailDto.product_id,
            description: detailDto.description,
            unit_price: detailDto.unit_price,
            quantity: detailDto.quantity,
            discount_percent: detailDto.discount_percent ?? 0,
            tax_rate: detailDto.tax_rate ?? 0,
            salesOrder: undefined, // link later
          });
        },
      );

      // ----------- UPDATE MAIN ORDER -----------
      salesOrderRepo.merge(existingOrder, {
        order_no: updateDto.order_no ?? existingOrder.order_no,
        order_date: updateDto.order_date ?? existingOrder.order_date,
        expected_delivery_date: updateDto.expected_delivery_date ?? existingOrder.expected_delivery_date,
        actual_delivery_date: updateDto.actual_delivery_date ?? existingOrder.actual_delivery_date,
        order_priority: updateDto.order_priority ?? existingOrder.order_priority,
        shipping_charges: updateDto.shipping_charges ?? existingOrder.shipping_charges ?? 0,
        order_status: updateDto.order_status ?? existingOrder.order_status,
        delivery_status: updateDto.delivery_status ?? existingOrder.delivery_status,
        payment_status: updateDto.payment_status ?? existingOrder.payment_status,
        currency_code: updateDto.currency_code ?? existingOrder.currency_code,
        exchange_rate: updateDto.exchange_rate ?? existingOrder.exchange_rate,
        notes: updateDto.notes ?? existingOrder.notes,
        terms_conditions: updateDto.terms_conditions ?? existingOrder.terms_conditions,
        delivery_address: updateDto.delivery_address ?? existingOrder.delivery_address,
        company_id: updateDto.company_id ?? existingOrder.company_id,
        branch_id: updateDto.branch_id ?? existingOrder.branch_id,
        customer_id: updateDto.customer_id ?? existingOrder.customer_id,
        sales_person_id: updateDto.sales_person_id ?? existingOrder.sales_person_id,
        sales_status: updateDto.sales_status ?? existingOrder.sales_status,
        subtotal: subtotal,
        total_amount: subtotal + (updateDto.shipping_charges ?? existingOrder.shipping_charges ?? 0),
      });

      const updatedOrder = await salesOrderRepo.save(existingOrder);

      // ----------- SAVE NEW DETAILS -----------
      for (const detail of salesOrderDetails) {
        detail.salesOrder = updatedOrder;
      }
      const savedDetails = await detailRepo.save(salesOrderDetails);

      return {
        success: true,
        message: 'Sales order updated successfully!',
        data: {
          salesOrder: updatedOrder,
          salesOrderDetails: savedDetails,
        },
      };
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
