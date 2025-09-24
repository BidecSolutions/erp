import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository  , DataSource} from 'typeorm';
import { SalesOrder } from './entity/sales-order.entity';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto/sales-order.dto';
import { successResponse } from 'src/commonHelper/response.util';
import { SalesOrderDetail } from './entity/sales-order-detail.entity';


// 👇 dummy entities import karo agar exist hain
// import { Company } from 'src/company/entity/company.entity';
// import { Branch } from 'src/branch/entity/branch.entity';
// import { Customer } from 'src/customer/entity/customer.entity';
// import { SalesPerson } from 'src/sales-person/entity/sales-person.entity';

@Injectable()
export class SalesOrderService {
  constructor(
     @InjectRepository(SalesOrder)
     private readonly orderRepo: Repository<SalesOrder>,
     private dataSource: DataSource,

    // @InjectRepository(Company)
    // private readonly companyRepo: Repository<Company>,

    // @InjectRepository(Branch)
    // private readonly branchRepo: Repository<Branch>,

    // @InjectRepository(Customer)
    // private readonly customerRepo: Repository<Customer>,

    // @InjectRepository(SalesPerson)
    // private readonly salesPersonRepo: Repository<SalesPerson>,
  ) {}

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

async store(createDto: CreateSalesOrderDto) {
  try {
    return await this.dataSource.transaction(async (manager) => {
      // Step 1: Create and save SalesOrder
      const salesOrderRepo = manager.getRepository(SalesOrder);
      const order = salesOrderRepo.create(createDto);
      const savedSaleOrder = await salesOrderRepo.save(order);

      // Step 2: Save SalesOrderDetails if provided
      if (createDto.salesOrderDetails && createDto.salesOrderDetails.length > 0) 
 {
        const detailRepo = manager.getRepository(SalesOrderDetail);
        const details = createDto.salesOrderDetails.map((detailDto) =>
          detailRepo.create({
            ...detailDto,
            salesOrder: savedSaleOrder, // ✅ attach relation
          }),
        );

        await detailRepo.save(details);
      }

      return successResponse('Sales order created successfully!', {
        savedSaleOrder,
      });
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException('Sales order already exists');
    }
    throw new BadRequestException(error.message || 'Failed to create sales order');
  }
}


  // ✅ GET ALL
  async findAll() {
    const orders = await this.orderRepo.find({
      relations: ['details'],
      order: { id: 'DESC' },
    });

    return {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    };
  }

  // ✅ GET ONE
  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: {  id },
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return {
      success: true,
      message: 'Order fetched successfully',
      data: order,
    };
  }

  // ✅ UPDATE
  async update(id: number, dto: UpdateSalesOrderDto) {
    const existing = await this.orderRepo.findOne({ where: { id: id } });
    if (!existing) throw new NotFoundException(`Order with ID ${id} not found`);

    // if (dto.company_id) {
    //   const company = await this.companyRepo.findOne({
    //     where: { company_id: dto.company_id },
    //   });
    //   if (!company) throw new BadRequestException('Invalid company_id');
    // }

    // if (dto.branch_id) {
    //   const branch = await this.branchRepo.findOne({
    //     where: { branch_id: dto.branch_id },
    //   });
    //   if (!branch) throw new BadRequestException('Invalid branch_id');
    // }

    // if (dto.customer_id) {
    //   const customer = await this.customerRepo.findOne({
    //     where: { customer_id: dto.customer_id },
    //   });
    //   if (!customer) throw new BadRequestException('Invalid customer_id');
    // }

    // if (dto.sales_person_id) {
    //   const salesPerson = await this.salesPersonRepo.findOne({
    //     where: { sales_person_id: dto.sales_person_id },
    //   });
    //   if (!salesPerson) throw new BadRequestException('Invalid sales_person_id');
    // }

    Object.assign(existing, dto, {
      updated_at: new Date().toISOString().split('T')[0],
    });

    const updated = await this.orderRepo.save(existing);

    return {
      success: true,
      message: 'Order updated successfully',
      data: updated,
    };
  }

  // ✅ TOGGLE SOFT DELETE
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
