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


  // async store(createDto: CreateSalesOrderDto) {
  //   try {
  //     return await this.dataSource.transaction(async (manager) => {

  //       if (createDto.company_id) {
  //       const company = await manager.getRepository(Company).findOne({ where: { id: createDto.company_id } });
  //       if (!company) throw new BadRequestException(`Company #${createDto.company_id} not found`);
  //     }

  //     if (createDto.branch_id) {
  //       const branch = await manager.getRepository(Branch).findOne({ where: { id: createDto.branch_id } });
  //       if (!branch) throw new BadRequestException(`Branch #${createDto.branch_id} not found`);
  //     }

  //     if (createDto.customer_id) {
  //       const customer = await manager.getRepository(Customer).findOne({ where: { id: createDto.customer_id } });
  //       if (!customer) throw new BadRequestException(`Customer #${createDto.customer_id} not found`);
  //     }

      
  //     // ✅ Product validation
  //     if (
  //       createDto.salesOrderDetails &&
  //       createDto.salesOrderDetails.length > 0
  //     ) {
  //       for (const detail of createDto.salesOrderDetails) {
  //         const product = await manager
  //           .getRepository(Product)
  //           .findOne({ where: { id: detail.product_id } });

  //         if (!product) {
  //           throw new BadRequestException(
  //             `Product #${detail.product_id} not found`,
  //           );
  //         }
  //       }
  //     }

  //       // Step 1: Create and save SalesOrder
  //       const salesOrderRepo = manager.getRepository(SalesOrder);
  //       const order = salesOrderRepo.create(createDto);
  //       const savedSaleOrder = await salesOrderRepo.save(order);

  //       let sales_order_details: SalesOrderDetail[] = [];

  //       // Step 2: Save SalesOrderDetails if provided
  //       if (createDto.salesOrderDetails && createDto.salesOrderDetails.length > 0) {
  //         const detailRepo = manager.getRepository(SalesOrderDetail);

  //         sales_order_details = createDto.salesOrderDetails.map((detailDto) =>
  //           detailRepo.create({
  //             ...detailDto,
  //             salesOrder: savedSaleOrder,  // ✅ relation set automatically
  //           }),
  //         );

  //         await detailRepo.save(sales_order_details);
  //       }

  //       return successResponse('Sales order created successfully!', {
  //         savedSaleOrder,
  //         sales_order_details,
  //       });
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
      // ---------------- VALIDATIONS ----------------
      if (createDto.company_id) {
        const company = await manager.getRepository(Company).findOne({
          where: { id: createDto.company_id },
        });
        if (!company)
          throw new BadRequestException(
            `Company #${createDto.company_id} not found`,
          );
      }

      if (createDto.branch_id) {
        const branch = await manager.getRepository(Branch).findOne({
          where: { id: createDto.branch_id },
        });
        if (!branch)
          throw new BadRequestException(
            `Branch #${createDto.branch_id} not found`,
          );
      }

      if (createDto.customer_id) {
        const customer = await manager.getRepository(Customer).findOne({
          where: { id: createDto.customer_id },
        });
        if (!customer)
          throw new BadRequestException(
            `Customer #${createDto.customer_id} not found`,
          );
      }

      // ✅ Product validation
      for (const detail of createDto.salesOrderDetails ?? []) {
        const product = await manager
          .getRepository(Product)
          .findOne({ where: { id: detail.product_id } });

        if (!product) {
          throw new BadRequestException(
            `Product #${detail.product_id} not found`,
          );
        }
      }

      // ---------------- CREATE ORDER ----------------
      const salesOrderRepo = manager.getRepository(SalesOrder);
      const order = salesOrderRepo.create(createDto);
      const savedSaleOrder = await salesOrderRepo.save(order);

      let sales_order_details: SalesOrderDetail[] = [];

      // ---------------- CREATE ORDER DETAILS ----------------
      if ((createDto.salesOrderDetails ?? []).length > 0) {
        const detailRepo = manager.getRepository(SalesOrderDetail);

        sales_order_details = (createDto.salesOrderDetails ?? []).map(
          (detailDto) =>
            detailRepo.create({
              ...detailDto,
              salesOrder: savedSaleOrder, // ✅ link with order
              product: { id: detailDto.product_id }, // ✅ ensure product_id goes into relation
            }),
        );

        await detailRepo.save(sales_order_details);
      }

      return successResponse('Sales order created successfully!', {
        savedSaleOrder,
        sales_order_details,
      });
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException('Sales order already exists');
    }
    throw new BadRequestException(
      error.message || 'Failed to create sales order',
    );
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



async update(id: number, updateDto: UpdateSalesOrderDto) {
  try {
    // Step 1: Find existing order
    const existingOrder = await this.orderRepo.findOne({ where: { id } });
    if (!existingOrder) {
      return errorResponse(`Sale order #${id} not found`);
    }

    if (updateDto.company_id) {
      const companyExists = await this.companyRepo.findOne({ where: { id: updateDto.company_id } });
      if (!companyExists) return errorResponse(`Company #${updateDto.company_id} not found`);
    }

    if (updateDto.branch_id) {
      const branchExists = await this.branchRepo.findOne({ where: { id: updateDto.branch_id } });
      if (!branchExists) return errorResponse(`Branch #${updateDto.branch_id} not found`);
    }

    if (updateDto.customer_id) {
      const customerExists = await this.customerRepo.findOne({ where: { id: updateDto.customer_id } });
      if (!customerExists) return errorResponse(`Customer #${updateDto.customer_id} not found`);
    }

    // ✅ Product validation if salesOrderDetails exist
    if (updateDto.salesOrderDetails && updateDto.salesOrderDetails.length > 0) {
      for (const detail of updateDto.salesOrderDetails) {
        if (detail.product_id) {
          const productExists = await this.productRepo.findOne({ where: { id: detail.product_id } });
          if (!productExists) {
            return errorResponse(`Product #${detail.product_id} not found`);
          }
        }
      }
    }

    const saleorder =await this.orderRepo.save({ id, ...updateDto });
    return successResponse('Sale order updated successfully!' , saleorder);

  } catch (error) {
    return errorResponse('Failed to update sale_order', error.message);
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
