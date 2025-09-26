import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerInvoice } from './customer-invoice.entity';
import { CreateCustomerInvoiceDto } from './dto/create-customer-invoice.dto';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';

@Injectable()
export class CustomerInvoiceService {
  constructor(
    @InjectRepository(CustomerInvoice)
    private invoiceRepo: Repository<CustomerInvoice>,
  ) {}

  async create(dto: CreateCustomerInvoiceDto) {
    try {
      const invoice = this.invoiceRepo.create({
        ...dto,
        company: { id: dto.company_id } as Company,
        customer: { id: dto.customer_id } as Customer,
      });

      const saved = await this.invoiceRepo.save(invoice);
      return { success: true, message: 'Customer Invoice created successfully', data: saved };
    } catch (error) {
      return { success: false, message: 'Failed to create invoice', error: error.message };
    }
  }
}
