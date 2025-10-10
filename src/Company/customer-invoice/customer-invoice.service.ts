import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CustomerInvoice } from './entity/customer-invoice.entity';
import { CreateCustomerInvoiceDto } from './dto/create-customer-invoice.dto';
import { Company } from '../companies/company.entity';
import { Customer } from '../customers/customer.entity';
import { SalesOrder } from 'src/sales/sales-order/entity/sales-order.entity';
import { customer_invoice_items } from './entity/customer-invoice-items.entity';
import { productVariant } from 'src/procurement/product/entities/variant.entity';
import { generateCode } from 'src/commonHelper/response.util';

@Injectable()
export class CustomerInvoiceService {
  constructor(
    @InjectRepository(CustomerInvoice)
    private invoiceRepo: Repository<CustomerInvoice>,
    private dataSource: DataSource,

    @InjectRepository(Company)
    private companyRepo: Repository<Company>,

    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,

    @InjectRepository(SalesOrder)
    private salesOrderRepo: Repository<SalesOrder>,


  ) { }

  async createInvoice(createDto: CreateCustomerInvoiceDto) {
    return await this.dataSource.transaction(async (manager) => {
      const salesOrderRepo = manager.getRepository(SalesOrder);
      const invoiceRepo = manager.getRepository(CustomerInvoice);
      const itemRepo = manager.getRepository(customer_invoice_items);
      const variantRepo = manager.getRepository(productVariant);


      const order = await salesOrderRepo.findOne({
        where: { id: createDto.sales_order_id },
        relations: ['salesOrderDetails', 'customer'],
      });

      if (!order) {
        throw new BadRequestException('Sales order not found');
      }


      // const subtotal = order.salesOrderDetails.reduce(
      //   (sum, d) => sum + d.quantity * d.unit_price,
      //   0,
      // );

      // const discount_amount = createDto.discount_amount ?? 0;
      // const tax_amount = createDto.tax_amount ?? 0;


      // const paid_amount = 0;

      // const total_amount = subtotal - discount_amount + tax_amount;
      // const outstanding_amount = total_amount;

      const subtotal = order.salesOrderDetails.reduce(
        (sum, d) => sum + d.quantity * d.unit_price,
        0,
      );

      const discount_amount = createDto.discount_amount ?? 0;
      const tax_amount = createDto.tax_amount ?? 0;

      // amount received so far (maybe 0 for new invoices)
      const paid_amount = 0;

      // total invoice amount
      const total_amount = subtotal - discount_amount + tax_amount;

      // outstanding = total - paid
      const outstanding_amount = total_amount - paid_amount;


      const invoiceNumber = await generateCode('customer-invoice', 'INV', this.dataSource);
      const invoice = invoiceRepo.create({
        company: { id: createDto.company_id } as any,
        branch_id: createDto.branch_id,
        salesOrder: order,
        customer: order.customer,
        invoice_no: invoiceNumber,
        invoice_date: createDto.invoice_date,
        due_date: createDto.due_date,
        payment_terms: createDto.payment_terms,
        notes: createDto.notes,
        attachment_path: createDto.attachment_path,


        subtotal: subtotal,
        discount_amount,
        tax_amount,

        outstanding_amount,
        total_amount,
        paid_amount,
      });

      const savedInvoice = await invoiceRepo.save(invoice);


      if (order.salesOrderDetails && order.salesOrderDetails.length > 0) {
        const items = order.salesOrderDetails.map((detail) =>
          itemRepo.create({
            customerInvoice: savedInvoice,
            product_id: detail.product_id,
            variant_id: detail.variant_id,
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            total_price: detail.quantity * detail.unit_price,
          }),
        );

        await itemRepo.save(items);
        savedInvoice.invoiceItems = items;
      }

      return {
        success: true,
        message: 'Customer invoice created successfully!',
        data: savedInvoice,
      };
    });
  }

}
