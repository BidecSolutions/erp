import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Company } from '../companies/company.entity';
import { CustomerCategory } from '../customer-categories/customer-category.entity';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customerRepo: Repository<Customer>,
        @InjectRepository(Company)
        private companyRepo: Repository<Company>,
        @InjectRepository(CustomerCategory)
        private categoryRepo: Repository<CustomerCategory>,
    ) { }

    async create(dto: CreateCustomerDto) {
        try {
            // Check if company exists and is active
            const company = await this.companyRepo.findOne({
                where: { id: dto.company_id, status: 1 },
            });
            if (!company) {
                return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
            }

            // Check if category_customer exists and is active
            const category = await this.categoryRepo.findOne({
                where: { id: dto.category_customer, is_active: 1 },
            });
            if (!category) {
                return { success: false, message: `Customer category with ID ${dto.category_customer} not found or inactive` };
            }

            // Create customer
            const customer = this.customerRepo.create({
                ...dto,
                company: { id: dto.company_id } as Company,
                category_customer: { id: dto.category_customer } as CustomerCategory,
            });

            const saved = await this.customerRepo.save(customer);
            return { success: true, message: 'Customer created successfully', data: saved };
        } catch (error) {
            return { success: false, message: 'Failed to create customer', error };
        }
    }

    async findAll() {
        try {
            const customers = await this.customerRepo.find({
                relations: ['company', 'category_customer'],
                where: { is_active: 1 },
                order: { id: 'DESC' },
                select: {
                    id: true,
                    customer_code: true,
                    customer_name: true,
                    customer_type: true,
                    contact_person: true,
                    designation: true,
                    email: true,
                    phone: true,
                    mobile: true,
                    website: true,
                    address_line1: true,
                    address_line2: true,
                    city: true,
                    state: true,
                    country: true,
                    postal_code: true,
                    credit_limit: true,
                    credit_days: true,
                    payment_terms: true,
                    tax_id: true,
                    gst_no: true,
                    pan_no: true,
                    opening_balance: true,
                    balance_type: true,
                    customer_status: true,
                    registration_date: true,
                    notes: true,
                    assigned_sales_person: true,
                    is_active: true,
                    created_by: true,
                    created_date: true,
                    updated_by: true,
                    updated_date: true,
                    company: {
                        id: true,
                        company_name: true,
                    },
                    category_customer: {
                        id: true,
                        category_name: true,
                    },
                },
            });
            return { success: true, data: customers };
        } catch (error) {
            return { success: false, message: 'Failed to fetch customers', error };
        }
    }

    async findOne(id: number) {
        try {
            const customer = await this.customerRepo.findOne({
                where: { id, is_active: 1 },
                relations: ['company', 'category_customer'],
                select: {
                    id: true,
                    customer_code: true,
                    customer_name: true,
                    customer_type: true,
                    contact_person: true,
                    designation: true,
                    email: true,
                    phone: true,
                    mobile: true,
                    website: true,
                    address_line1: true,
                    address_line2: true,
                    city: true,
                    state: true,
                    country: true,
                    postal_code: true,
                    credit_limit: true,
                    credit_days: true,
                    payment_terms: true,
                    tax_id: true,
                    gst_no: true,
                    pan_no: true,
                    opening_balance: true,
                    balance_type: true,
                    customer_status: true,
                    registration_date: true,
                    notes: true,
                    assigned_sales_person: true,
                    is_active: true,
                    created_by: true,
                    created_date: true,
                    updated_by: true,
                    updated_date: true,
                    company: {
                        id: true,
                        company_name: true,
                    },
                    category_customer: {
                        id: true,
                        category_name: true,
                    },
                },
            });

            if (!customer)
                return { success: false, message: `Customer with ID ${id} not found` };

            return { success: true, data: customer };
        } catch (error) {
            return { success: false, message: 'Failed to fetch customer', error };
        }
    }



    async update(id: number, dto: UpdateCustomerDto) {
        try {
            const customer = await this.customerRepo.findOne({
                where: { id, is_active: 1 },
            });
            if (!customer) return { success: false, message: 'Customer not found or inactive' };

            // Check if company exists and is active
            const company = await this.companyRepo.findOne({
                where: { id: dto.company_id, status: 1 },
            });
            if (!company) {
                return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
            }

            // Check if category_customer exists and is active
            const category = await this.categoryRepo.findOne({
                where: { id: dto.category_customer, is_active: 1 },
            });
            if (!category) {
                return { success: false, message: `Customer category with ID ${dto.category_customer} not found or inactive` };
            }

            // Update relations if provided
            if (dto.company_id) customer.company = { id: dto.company_id } as Company;
            if (dto.category_customer) customer.category_customer = { id: dto.category_customer } as CustomerCategory;

            Object.assign(customer, dto);

            const updated = await this.customerRepo.save(customer);
            return { success: true, message: 'Customer updated successfully', data: updated };
        } catch (error) {
            return { success: false, message: 'Failed to update customer', error };
        }
    }

    async remove(id: number) {
        try {
            const customer = await this.customerRepo.findOne({
                where: { id, is_active: 1 },
            });
            if (!customer) return { success: false, message: 'Customer not found or already inactive' };

            // Soft delete by setting is_active = 2
            customer.is_active = 2;
            await this.customerRepo.save(customer);

            return { success: true, message: 'Customer deleted successfully (soft delete)', data: customer };
        } catch (error) {
            return { success: false, message: 'Failed to delete customer', error };
        }
    }

}
