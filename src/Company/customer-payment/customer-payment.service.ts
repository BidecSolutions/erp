import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerPayment } from './customer-payment.entity';
import { CreateCustomerPaymentDto } from './dto/create-customer-payment.dto';
import { UpdateCustomerPaymentDto } from './dto/update-customer-payment.dto';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectRepository(CustomerPayment)
    private readonly paymentRepo: Repository<CustomerPayment>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

 async create(dto: CreateCustomerPaymentDto, filePath: string) {
  try {
    const company = await this.companyRepo.findOne({ where: { id: dto.company_id, status: 1 } });
    if (!company) return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };

    const customer = await this.customerRepo.findOne({ where: { id: dto.customer_id, is_active: 1 } });
    if (!customer) return { success: false, message: `Customer with ID ${dto.customer_id} not found or inactive` };

    const payment = this.paymentRepo.create({
      ...dto,
      company: { id: dto.company_id } as Company,
      customer: { id: dto.customer_id } as Customer,
      attachment_path: filePath,
    });

    const saved = await this.paymentRepo.save(payment);
    return { success: true, message: 'Customer Payment created successfully', data: saved };
  } catch (error) {
    return { success: false, message: 'Failed to create Customer Payment', error };
  }
}

  async findAll() {
    try {
      const payments = await this.paymentRepo.find({
        relations: ['company', 'customer'],
        where: { status: 1 },
        order: { id: 'DESC' },
      });
      return { success: true, data: payments };
    } catch (error) {
      return { success: false, message: 'Failed to fetch Customer Payments', error };
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.paymentRepo.findOne({
        where: { id, status: 1 },
        relations: ['company', 'customer'],
      });
      if (!payment) return { success: false, message: `Customer Payment with ID ${id} not found` };
      return { success: true, data: payment };
    } catch (error) {
      return { success: false, message: 'Failed to fetch Customer Payment', error };
    }
  }

//   async update(id: number, dto: UpdateCustomerPaymentDto) {
//     try {
//       const payment = await this.paymentRepo.findOne({ where: { id, status: 1 } });
//       if (!payment) return { success: false, message: 'Customer Payment not found or inactive' };

//       if (dto.company_id) {
//         const company = await this.companyRepo.findOne({ where: { id: dto.company_id, status: 1 } });
//         if (!company) return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
//         payment.company = { id: dto.company_id } as Company;
//       }

//       if (dto.customer_id) {
//         const customer = await this.customerRepo.findOne({ where: { id: dto.customer_id, is_active: 1 } });
//         if (!customer) return { success: false, message: `Customer with ID ${dto.customer_id} not found or inactive` };
//         payment.customer = { id: dto.customer_id } as Customer;
//       }

//       Object.assign(payment, dto);
//       const updated = await this.paymentRepo.save(payment);
//       return { success: true, message: 'Customer Payment updated successfully', data: updated };
//     } catch (error) {
//       return { success: false, message: 'Failed to update Customer Payment', error };
//     }
//   }

//   async remove(id: number) {
//     try {
//       const payment = await this.paymentRepo.findOne({ where: { id, status: 1 } });
//       if (!payment) return { success: false, message: 'Customer Payment not found or already inactive' };

//       payment.status = 2;
//       await this.paymentRepo.save(payment);

//       return { success: true, message: 'Customer Payment deleted successfully (soft delete)', data: payment };
//     } catch (error) {
//       return { success: false, message: 'Failed to delete Customer Payment', error };
//     }
//   }
}
