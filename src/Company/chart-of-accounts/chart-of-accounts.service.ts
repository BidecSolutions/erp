import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChartOfAccount } from './chart-of-account.entity';
import { CreateChartOfAccountDto } from './dto/create-chart-of-account.dto';
import { UpdateChartOfAccountDto } from './dto/update-chart-of-account.dto';
import { Company } from '../companies/company.entity';

@Injectable()
export class ChartOfAccountsService {
    constructor(
        @InjectRepository(ChartOfAccount)
        private readonly chartRepo: Repository<ChartOfAccount>,
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,
    ) { }

    async create(dto: CreateChartOfAccountDto) {
        try {
            const company = await this.companyRepo.findOne({ where: { id: dto.company_id, status: 1 } });
            if (!company) {
                return { success: false, message: `Company with ID ${dto.company_id} not found or inactive` };
            }

            const chart = this.chartRepo.create({
                ...dto,
                company: { id: dto.company_id } as Company,
            });

            await this.chartRepo.save(chart);
            return { success: true, message: 'Chart of Account created successfully', data: chart };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to create Chart of Account' };
        }
    }

    async findAll() {
        try {
            const data = await this.chartRepo.find({
                relations: ['company'],
                select: {
                    id: true,
                    name: true,
                    is_bank_account: true,
                    is_cash_account: true,
                    status: true,
                    created_date: true,
                    updated_date: true,
                    company: {
                        id: true,
                        company_name: true,
                    },
                },
                order: { id: 'DESC' },
            });
            return { success: true, message: 'Chart of Accounts retrieved successfully', data };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve Chart of Accounts' };
        }
    }

    async findOne(id: number) {
        try {
            const chart = await this.chartRepo.findOne({
                where: { id, status: 1 },
                relations: ['company'],
                select: {
                    id: true,
                    name: true,
                    is_bank_account: true,
                    is_cash_account: true,
                    status: true,
                    created_date: true,
                    updated_date: true,
                    company: {
                        id: true,
                        company_name: true,
                    },
                },
            });
            if (!chart) return { success: false, message: `Chart of Account with ID ${id} not found` };
            return { success: true, message: 'Chart of Account retrieved successfully', data: chart };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to retrieve Chart of Account' };
        }
    }

    async update(id: number, dto: UpdateChartOfAccountDto) {
        try {
            const chart = await this.chartRepo.findOne({ where: { id, status: 1 } });
            if (!chart) return { success: false, message: `Chart of Account with ID ${id} not found or inactive` };

            Object.assign(chart, dto, { updated_date: new Date().toISOString().split('T')[0] });
            await this.chartRepo.save(chart);

            return { success: true, message: 'Chart of Account updated successfully', data: chart };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Failed to update Chart of Account' };
        }
    }

    async toggleStatus(id: number) {
        try {
            const chart = await this.chartRepo.findOneBy({ id });
            if (!chart) {
                return { status: false, message: `Chart of Account with ID ${id} not found` };
            }

            // Toggle status: 1 = active, 0 = inactive
            chart.status = chart.status === 1 ? 0 : 1;

            // Update date (keeping your logic)
            chart.updated_date = new Date().toISOString().split('T')[0];

            await this.chartRepo.save(chart);

            const action = chart.status === 1 ? 'activated' : 'deactivated';

            return {
                status: true,
                message: `Chart of Account ${action} successfully`,
                data: chart,
            };
        } catch (error) {
            console.error(error);
            return { status: false, message: 'Failed to toggle Chart of Account status', error: error.message };
        }
    }

}
