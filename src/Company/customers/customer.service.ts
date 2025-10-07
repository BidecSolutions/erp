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
  ) {}

  // async create(dto: CreateCustomerDto) {
  //     try {
  //         // Check if company exists and is active
  //         const company = await this.companyRepo.findOne({
  //             where: { id: dto.company_id, status: 1 },
  //         });
  //         if (!company) {
  //             return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
  //         }

  //         // Check if category_customer exists and is active
  //         const category = await this.categoryRepo.findOne({
  //             where: { id: dto.category_customer, is_active: 1 },
  //         });
  //         if (!category) {
  //             return { success: false, message: `Customer category with ID ${dto.category_customer} not found or inactive` };
  //         }

  //         // Create customer
  //         const customer = this.customerRepo.create({
  //             ...dto,
  //             company: { id: dto.company_id } as Company,
  //             category_customer: { id: dto.category_customer } as CustomerCategory,
  //         });

  //         const saved = await this.customerRepo.save(customer);

  //         // // Create default customer_account with amount = 0
  //         const account = this.customerAccountRepo.create({
  //             customer: { id: saved.id } as Customer,
  //             amount: 0,
  //         });
  //         const savedAccount = await this.customerAccountRepo.save(account);
  //         return {
  //             success: true, message: 'Customer created successfully', data: {
  //                 ...saved,
  //                 account: {
  //                     id: savedAccount.id,
  //                     amount: savedAccount.amount,
  //                 },
  //             },
  //         };
  //     } catch (error) {
  //         return { success: false, message: 'Failed to create customer', error };
  //     }
  // }
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
        company_id,
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

  // async findAll() {
  //     try {
  //         const customers = await this.customerRepo.find({
  //             relations: ['company', 'category_customer'],
  //             where: { is_active: 1 },
  //             order: { id: 'DESC' },
  //             select: {
  //                 id: true,
  //                 customer_code: true,
  //                 customer_name: true,
  //                 customer_type: true,
  //                 contact_person: true,
  //                 designation: true,
  //                 email: true,
  //                 phone: true,
  //                 mobile: true,
  //                 website: true,
  //                 address_line1: true,
  //                 address_line2: true,
  //                 city: true,
  //                 state: true,
  //                 country: true,
  //                 postal_code: true,
  //                 credit_limit: true,
  //                 credit_days: true,
  //                 payment_terms: true,
  //                 tax_id: true,
  //                 gst_no: true,
  //                 pan_no: true,
  //                 opening_balance: true,
  //                 balance_type: true,
  //                 customer_status: true,
  //                 registration_date: true,
  //                 notes: true,
  //                 assigned_sales_person: true,
  //                 is_active: true,
  //                 created_by: true,
  //                 created_date: true,
  //                 updated_by: true,
  //                 updated_date: true,
  //                 company: {
  //                     id: true,
  //                     company_name: true,
  //                 },
  //                 category_customer: {
  //                     id: true,
  //                     category_name: true,
  //                 },
  //             },
  //         });
  //         return { success: true, data: customers };
  //     } catch (error) {
  //         return { success: false, message: 'Failed to fetch customers', error };
  //     }
  // }
  async findAll(company_id: number, filterStatus?: number) {
    const is_active = filterStatus !== undefined ? filterStatus : 1; // default active=1
    try {
      const customers = await this.customerRepo
        .createQueryBuilder("customer")
        .leftJoin("customer.company", "company")
        .leftJoin("customer.category_customer", "category_customer")
        .select([
          "customer.id",
          "customer.customer_code",
          "customer.customer_name",
          "customer.customer_type",
          "customer.contact_person",
          "customer.designation",
          "customer.email",
          "customer.phone",
          "customer.mobile",
          "customer.website",
          "customer.address_line1",
          "customer.address_line2",
          "customer.city",
          "customer.state",
          "customer.country",
          "customer.postal_code",
          "customer.credit_limit",
          "customer.credit_days",
          "customer.payment_terms",
          "customer.tax_id",
          "customer.gst_no",
          "customer.pan_no",
          "customer.opening_balance",
          "customer.balance_type",
          "customer.customer_status",
          "customer.registration_date",
          "customer.notes",
          "customer.assigned_sales_person",
          "customer.is_active",
          "company.company_name",
          "category_customer.category_name",
        ])
        .where("customer.company_id = :company_id", { company_id })
        .andWhere("customer.is_active = :is_active", { is_active })
        .orderBy("customer.id", "DESC")
        .getRawMany();

      return customers;
    } catch (e) {
      return { message: e.message };
    }
  }

  // async findOne(id: number) {
  //     try {
  //         const customer = await this.customerRepo.findOne({
  //             where: { id, is_active: 1 },
  //             relations: ['company', 'category_customer'],
  //             select: {
  //                 id: true,
  //                 customer_code: true,
  //                 customer_name: true,
  //                 customer_type: true,
  //                 contact_person: true,
  //                 designation: true,
  //                 email: true,
  //                 phone: true,
  //                 mobile: true,
  //                 website: true,
  //                 address_line1: true,
  //                 address_line2: true,
  //                 city: true,
  //                 state: true,
  //                 country: true,
  //                 postal_code: true,
  //                 credit_limit: true,
  //                 credit_days: true,
  //                 payment_terms: true,
  //                 tax_id: true,
  //                 gst_no: true,
  //                 pan_no: true,
  //                 opening_balance: true,
  //                 balance_type: true,
  //                 customer_status: true,
  //                 registration_date: true,
  //                 notes: true,
  //                 assigned_sales_person: true,
  //                 is_active: true,
  //                 created_by: true,
  //                 created_date: true,
  //                 updated_by: true,
  //                 updated_date: true,
  //                 company: {
  //                     id: true,
  //                     company_name: true,
  //                 },
  //                 category_customer: {
  //                     id: true,
  //                     category_name: true,
  //                 },
  //             },
  //         });

  //         if (!customer)
  //             return { success: false, message: `Customer with ID ${id} not found` };

  //         return { success: true, data: customer };
  //     } catch (error) {
  //         return { success: false, message: 'Failed to fetch customer', error };
  //     }
  // }
  async findOne(id: number) {
    try {
      const customer = await this.customerRepo
        .createQueryBuilder("customer")
        .leftJoin("customer.company", "company")
        .leftJoin("customer.category_customer", "category")
        .select([
          "customer.id",
          "customer.customer_code",
          "customer.customer_name",
          "customer.customer_type",
          "customer.contact_person",
          "customer.designation",
          "customer.email",
          "customer.phone",
          "customer.mobile",
          "customer.website",
          "customer.address_line1",
          "customer.address_line2",
          "customer.city",
          "customer.state",
          "customer.country",
          "customer.postal_code",
          "customer.credit_limit",
          "customer.credit_days",
          "customer.payment_terms",
          "customer.tax_id",
          "customer.gst_no",
          "customer.pan_no",
          "customer.opening_balance",
          "customer.balance_type",
          "customer.customer_status",
          "customer.registration_date",
          "customer.notes",
          "customer.assigned_sales_person",
          "customer.is_active",
          "customer.created_by",
          "customer.created_date",
          "customer.updated_by",
          "customer.updated_date",
          "company.company_name",
          "category.category_name",
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

  async update(id: number, dto: UpdateCustomerDto, company_id: number) {
    try {
      const customer = await this.customerRepo.findOne({
        where: { id, is_active: 1, company_id },
      });
      if (!customer)
        return { success: false, message: "Customer not found or inactive" };

      // Check if company exists and is active
      // const company = await this.companyRepo.findOne({
      //     where: { id: dto.company_id, status: 1 },
      // });
      // if (!company) {
      //     return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
      // }

      // Check if category_customer exists and is active
      const category = await this.categoryRepo.findOne({
        where: { id: dto.category_customer, is_active: 1 },
      });
      if (!category) {
        return {
          success: false,
          message: `Customer category with ID ${dto.category_customer} not found or inactive`,
        };
      }

      // Update relations if provided
      // if (dto.company_id) customer.company = { id: dto.company_id } as Company;
      if (dto.category_customer)
        customer.category_customer = {
          id: dto.category_customer,
        } as CustomerCategory;

      Object.assign(customer, dto);

      // const updated = await this.customerRepo.save(customer);
      //     return { success: true, message: 'Customer updated successfully', data: updated };
      // } catch (error) {
      //     return { success: false, message: 'Failed to update customer', error };
      await this.customerRepo.save(customer);

      const updated = await this.findAll(company_id);
      return updated;
    } catch (e) {
      return { message: e.message };
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
