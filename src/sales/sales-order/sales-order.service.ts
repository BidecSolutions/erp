import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Any } from 'typeorm';
import { SalesOrder } from './entity/sales-order.entity';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto/sales-order.dto';
import { errorResponse, successResponse } from 'src/commonHelper/response.util';
import { SalesOrderDetail } from './entity/sales-order-detail.entity';
import { Company } from 'src/Company/companies/company.entity';
import { Branch } from 'src/Company/branch/branch.entity';
import { Customer } from 'src/Company/customers/customer.entity';

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

    // @InjectRepository(SalesPerson)
    // private readonly salesPersonRepo: Repository<SalesPerson>,
  ) { }

  // // ✅ CREATE
  // async create(dto: CreateSalesOrderDto) {
  //   const exists = await this.orderRepo.findOne({
  //     where: { order_no: dto.order_no },
  //   });
  //   if (exists) {
  //     throw new BadRequestException(
  //       `Order number "${dto.order_no}" already exists`,
  //     );
  //   }

  //   // const company = await this.companyRepo.findOne({
  //   //   where: { company_id: dto.company_id },
  //   // });
  //   // if (!company) throw new BadRequestException('Invalid company_id');

  //   // const branch = await this.branchRepo.findOne({
  //   //   where: { branch_id: dto.branch_id },
  //   // });
  //   // if (!branch) throw new BadRequestException('Invalid branch_id');

  //   // const customer = await this.customerRepo.findOne({
  //   //   where: { customer_id: dto.customer_id },
  //   // });
  //   // if (!customer) throw new BadRequestException('Invalid customer_id');

  //   // const salesPerson = await this.salesPersonRepo.findOne({
  //   //   where: { sales_person_id: dto.sales_person_id },
  //   // });
  //   // if (!salesPerson) throw new BadRequestException('Invalid sales_person_id');

  //   const order = this.orderRepo.create({
  //     ...dto
  //   });

  //   const saved = await this.orderRepo.save(order);

  //   return {
  //     success: true,
  //     message: 'Order created successfully',
  //     data: saved,
  //   };
  // }

  //   async store(createDto: CreateSalesOrderDto) {
  //     try {
  //       return await this.dataSource.transaction(async (manager) => {

  //         // Step 1: Create and save SalesOrder
  //         const salesOrderRepo = manager.getRepository(SalesOrder);
  //         const order = salesOrderRepo.create(createDto);
  //         const savedSaleOrder = await salesOrderRepo.save(order);
  //         let sales_order_details: any[] = [];

  //         // Step 2: Save SalesOrderDetails if provided
  //         if (createDto.salesOrderDetails && createDto.salesOrderDetails.length > 0) {
  //           const detailRepo = manager.getRepository(SalesOrderDetail);

  //           // const sales_order_details = createDto.salesOrderDetails.map((salesOrderDetails) =>
  //           //   manager.getRepository(SalesOrderDetail).create({
  //           //     ...salesOrderDetails,
  //           //     salesOrder: savedSaleOrder,
  //           //   }),
  //           // );
  //  sales_order_details = createDto.salesOrderDetails.map((detailDto) =>
  //   detailRepo.create({
  //     ...detailDto,
  //     salesOrder: savedSaleOrder,
  //   }),
  // );
  // await detailRepo.save(sales_order_details);



  //           // await manager.getRepository(SalesOrderDetail).save(sales_order_details);
  //         }

  //         return successResponse('Sales order created successfully!', {
  //   savedSaleOrder,
  //   sales_order_details
  // });

  //       });
  //     } catch (error) {
  //       if (error.code === 'ER_DUP_ENTRY') {
  //         throw new BadRequestException('Sales order already exists');
  //       }
  //       throw new BadRequestException(error.message || 'Failed to create sales order');
  //     }
  //   }
  async store(createDto: CreateSalesOrderDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // Step 1: Create and save SalesOrder
        const salesOrderRepo = manager.getRepository(SalesOrder);
        const order = salesOrderRepo.create(createDto);
        const savedSaleOrder = await salesOrderRepo.save(order);

        let sales_order_details: SalesOrderDetail[] = [];

        // Step 2: Save SalesOrderDetails if provided
        if (createDto.salesOrderDetails && createDto.salesOrderDetails.length > 0) {
          const detailRepo = manager.getRepository(SalesOrderDetail);

          sales_order_details = createDto.salesOrderDetails.map((detailDto) =>
            detailRepo.create({
              ...detailDto,
              salesOrder: savedSaleOrder,  // ✅ relation set automatically
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



async update(id: number, updateDto: UpdateSalesOrderDto) {
  try {
    // Step 1: Find existing order
    const existingOrder = await this.orderRepo.findOne({ where: { id } });
    if (!existingOrder) {
      return errorResponse(`Sale order #${id} not found`);
    }

    // Step 2: Optional - validate foreign keys if needed
    // Example: check company
    if (updateDto.company_id) {
      const companyExists = await this.companyRepo.findOne({ where: { id: updateDto.company_id } });
      if (!companyExists) return errorResponse(`Company #${updateDto.company_id} not found`);
    }


    const saleorder =await this.orderRepo.save({ id, ...updateDto });
    return successResponse('Sale order updated successfully!' , saleorder);

  //   // Step 3: Handle nested salesOrderDetails
  //   if (updateDto.salesOrderDetails && updateDto.salesOrderDetails.length > 0) {
  //     // Delete old details
  // await this.detailRepo.delete({ order_id: id });

  //     // Prepare new details
  //     const newDetails = updateDto.salesOrderDetails.map(detail => ({
  //       ...detail,
  //       order: { id }, // link detail to parent order
  //     }));

  //     // Save new details
  //     await this.detailRepo.save(newDetails);

  //     // Remove from updateDto to avoid TypeORM issues
  //     delete updateDto.salesOrderDetails;
  //   }

    // Step 4: Update main sale order
    const updatedOrder = await this.orderRepo.save({ id, ...updateDto });

    return successResponse('Sale order updated successfully!', updatedOrder);

  } catch (error) {
    return errorResponse('Failed to update sale_order', error.message);
  }
}



  async toggleStatus(id: number) {
    const existing = await this.orderRepo.findOne({ where: { id: id } });
    if (!existing) throw new NotFoundException(`Order with ID ${id} not found`);

    existing.status = existing.status === 1 ? 0 : 1;
    await this.orderRepo.save(existing);

    return {
      success: true,
      message:
        existing.status === 1
          ? `Order with ID ${id} restored successfully`
          : `Order with ID ${id} deleted successfully`,
    };
  }
}
