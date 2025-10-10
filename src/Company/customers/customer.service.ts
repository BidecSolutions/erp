import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Customer } from "./customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Company } from "../companies/company.entity";
import { CustomerCategory } from "../customer-categories/customer-category.entity";
import { CustomerAccount } from "./customer.customer_account.entity";
import { errorResponse, toggleStatusResponse } from "src/commonHelper/response.util";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(CustomerCategory)
    private categoryRepo: Repository<CustomerCategory>,
    @InjectRepository(CustomerAccount)
    private customerAccountRepo: Repository<CustomerAccount>
  ) { }


  async create(dto: CreateCustomerDto, company_id: number) {
    try {
      // ✅ Check company existence
      const company = await this.companyRepo.findOne({
        where: { id: company_id, status: 1 },
      });
      if (!company)
        throw new NotFoundException(
          `Company ID ${company_id} not found`
        );

      // ✅ Check category existence
      const category = await this.categoryRepo.findOne({
        where: { id: dto.category_customer, is_active: 1 },
      });
      if (!category)
        throw new NotFoundException(
          `Customer category ID ${dto.category_customer} not found or inactive`
        );

      // ✅ Create new customer
      const customer = this.customerRepo.create({
        ...dto,
        category_customer: { id: dto.category_customer } as CustomerCategory,
        company: { id: company_id } as Company,
        is_active: 1,
      });

      await this.customerRepo.save(customer);

      // ✅ Create default customer account
      const account = this.customerAccountRepo.create({
        customer: { id: customer.id } as Customer,
        amount: 0,
      });
      await this.customerAccountRepo.save(account);

      const allCustomers = await this.findAll(company_id);
      return allCustomers;
    } catch (e) {
      return { message: e.message };
    }
  }

  async findAll(company_id: number, filterStatus?: number) {
    const is_active = filterStatus !== undefined ? filterStatus : 1; // default active=1
    try {
      const customers = await this.customerRepo
        .createQueryBuilder("customer")
        .leftJoin("customer.company", "company")
        .leftJoin("customer.category_customer", "category_customer")
        .select([
          "customer.id as id",
          "customer.customer_code as customer_code",
          "customer.customer_name as customer_name",
          "customer.customer_type as customer_type",
          "customer.contact_person as contact_person",
          "customer.designation as designation",
          "customer.email as email",
          "customer.phone as phone",
          "customer.mobile as mobile",
          "customer.website as website",
          "customer.address_line1 as address_line1",
          "customer.address_line2 as address_line2",
          "customer.city as city",
          "customer.state as state",
          "customer.country as country",
          "customer.postal_code as postal_code",
          "customer.credit_limit as credit_limit",
          "customer.credit_days as credit_days",
          "customer.payment_terms as payment_terms",
          "customer.tax_id  as tax_id",
          "customer.gst_no as gst_no",
          "customer.pan_no as pan_no",
          "customer.opening_balance as opening_balance",
          "customer.balance_type as balance_type",
          "customer.customer_status as customer_status",
          "customer.registration_date as registration_date",
          "customer.notes as notes",
          "customer.assigned_sales_person as assigned_sales_person",
          "customer.is_active as is_active",
          "company.company_name as company_name",
          "category_customer.category_name as category_name",
        ])
        .where("customer.company_id  = :company_id", { company_id })

        .orderBy("customer.id", "DESC")
        .getRawMany();

      return customers;
    } catch (e) {
      return { message: e.message };
    }
  }


  async findOne(id: number) {
    try {
      const customer = await this.customerRepo
        .createQueryBuilder("customer")
        .leftJoin("customer.company", "company")
        .leftJoin("customer.category_customer", "category")
        .select([
          "customer.id as id",
          "customer.customer_code as customer_code",
          "customer.customer_name as customer_name",
          "customer.customer_type as customer_type",
          "customer.contact_person as contact_person",
          "customer.designation as designation",
          "customer.email as email",
          "customer.phone as phone",
          "customer.mobile as mobile",
          "customer.website as website",
          "customer.address_line1 as address_line1",
          "customer.address_line2 as address_line2",
          "customer.city as city",
          "customer.state as state",
          "customer.country as country",
          "customer.postal_code as postal_code",
          "customer.credit_limit as credit_limit",
          "customer.credit_days as credit_days",
          "customer.payment_terms as payment_terms",
          "customer.tax_id  as tax_id",
          "customer.gst_no as gst_no",
          "customer.pan_no as pan_no",
          "customer.opening_balance as opening_balance",
          "customer.balance_type as balance_type",
          "customer.customer_status as customer_status",
          "customer.registration_date as registration_date",
          "customer.notes as notes",
          "customer.assigned_sales_person as assigned_sales_person",
          "customer.is_active as is_active",
          "company.company_name as company_name",
          "category_customer.category_name as category_name",
        ])
        .where("customer.id = :id", { id })
        .getRawOne();

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      return customer;
    } catch (e) {
      return { message: e.message };
    }
  }

  // async update(id: number, dto: UpdateCustomerDto, company_id: number) {
  //   // try {
  //   //   const customer = await this.customerRepo.findOne({
  //   //     where: {
  //   //       id, is_active: 1, company: { id: company_id },
  //   //     })};
  //   //   if (!customer)
  //   //     return { success: false, message: "Customer not found or inactive" };

  //   //   // Check if company exists and is active
  //   //   // const company = await this.companyRepo.findOne({
  //   //   //     where: { id: dto.company_id, status: 1 },
  //   //   // });
  //   //   // if (!company) {
  //   //   //     return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
  //   //   // }

  //   //   // Check if category_customer exists and is active
  //   //   const category = await this.categoryRepo.findOne({
  //   //     where: { id: dto.category_customer, is_active: 1 },
  //   //   });
  //   //   if (!category) {
  //   //     return {
  //   //       success: false,
  //   //       message: `Customer category with ID ${dto.category_customer} not found or inactive`,
  //   //     };
  //   //   }

  //   //   // Update relations if provided
  //   //   // if (dto.company_id) customer.company = { id: dto.company_id } as Company;
  //   //   if (dto.category_customer)
  //   //     customer.category_customer = {
  //   //       id: dto.category_customer,
  //   //     } as CustomerCategory;

  //   //   Object.assign(customer, dto);

  //   //   // const updated = await this.customerRepo.save(customer);
  //   //   //     return { success: true, message: 'Customer updated successfully', data: updated };
  //   //   // } catch (error) {
  //   //   //     return { success: false, message: 'Failed to update customer', error };
  //   //   await this.customerRepo.save(customer);

  //   //   const updated = await this.findAll(company_id);
  //   //   return updated;
  //   // } catch (e) {
  //   //   return { message: e.message };
  //   // }
  // }

  async update(id: number, dto: UpdateCustomerDto, companyId: number) {
    try {
      // Find the customer first to ensure it exists and belongs to the same company
      const customer = await this.customerRepo.findOne({
        where: { id, company: { id: companyId } },
        // relations: ['company'],
      });

      if (!customer) {
        throw new Error('Customer not found or does not belong to this company');
      }

      // Merge the new data into the existing entity
      Object.assign(customer, dto);

      // Save updated record
      await this.customerRepo.save(customer);

      // Re-fetch with only required company columns
      const updatedCustomer = await this.customerRepo
        .createQueryBuilder('customer')
        .leftJoin('customer.company', 'company')
        .where('customer.id = :id', { id })
        .select([
          // All customer columns
          'customer.id',
          'customer.customer_code',
          'customer.customer_name',
          'customer.customer_type',
          'customer.contact_person',
          'customer.designation',
          'customer.email',
          'customer.phone',
          'customer.mobile',
          'customer.website',
          'customer.address_line1',
          'customer.address_line2',
          'customer.city',
          'customer.state',
          'customer.country',
          'customer.postal_code',
          'customer.credit_limit',
          'customer.credit_days',
          'customer.payment_terms',
          'customer.tax_id',
          'customer.gst_no',
          'customer.pan_no',
          'customer.opening_balance',
          'customer.balance_type',
          'customer.customer_status',
          'customer.registration_date',
          'customer.notes',
          'customer.assigned_sales_person',
          'customer.is_active',
          'customer.created_by',
          'customer.created_date',
          'customer.updated_by',
          'customer.updated_date',
          'customer.company_id', // safe, because it's from customer table only

          // Only specific company fields
          'company.id',
          'company.company_name',
        ])
        .getOne();



      if (!updatedCustomer) {
        throw new NotFoundException(`Customer with ID ${id} not found after update`);
      }
      return {
        ...updatedCustomer,
        company_id: updatedCustomer.company?.id,
      };
    } catch (error) {
      throw new Error(error.message);

    }
  }



  async statusUpdate(id: number) {
    try {
      const cus = await this.customerRepo.findOneBy({ id });
      if (!cus) throw new NotFoundException("Customer not found");

      cus.is_active = cus.is_active === 0 ? 1 : 0;
      await this.customerRepo.save(cus);

      return toggleStatusResponse("Customer", cus.is_active);
    } catch (err) {
      return errorResponse("Something went wrong", err.message);
    }
  }
}
