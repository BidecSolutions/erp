import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { accountsChartOFAccount } from '../entity/chart-of-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChartOfAccoiuntService {

    constructor(
        @InjectRepository(accountsChartOFAccount)
        private chartRepo: Repository<accountsChartOFAccount>
    ) { }


    async create(body: any, company_id: number) {
        try {
            if (!body.chart_of_account_name) {
                return { message: 'Please Enter Chart of Account Name' };
            }

            // Check if name already exists in same company
            const exists = await this.chartRepo.findOne({
                where: { chart_of_account_name: body.chart_of_account_name, company_id },
            });

            if (exists) {
                return { message: 'Chart of Account already exists' };
            }

            const chart = this.chartRepo.create({
                chart_of_account_name: body.chart_of_account_name,
                company_id,
            });

            await this.chartRepo.save(chart);
            return {
                status: true,
                message: 'Chart of Account Added Successfully',
                data: await this.findAll(company_id),
            };
        } catch (e) {
            return { message: e.message };
        }
    }

    // List all
    async findAll(company_id: number) {
        try {
            const list = await this.chartRepo
                .createQueryBuilder('chart')
                .innerJoin('companies', 'c', 'chart.company_id = c.id')
                .select([
                    'chart.id AS id',
                    'chart.chart_of_account_name AS chart_of_account_name',
                    'chart.status AS status',
                    'c.company_name AS company_name',
                    'chart.id as chart_id',
                    'chart.created_at AS created_at',
                ])
                .where('chart.company_id = :company_id', { company_id })
                .orderBy('chart.id', 'DESC')
                .getRawMany();

            return { status: true, message: 'Get All Chart of Accounts', data: list };
        } catch (e) {
            return { message: e.message };
        }
    }

    // Find one
    async findOne(id: number) {
        try {
            const item = await this.chartRepo
                .createQueryBuilder('chart')
                .innerJoin('companies', 'c', 'chart.company_id = c.id')
                .select([
                    'chart.id AS id',
                    'chart.chart_of_account_name AS chart_of_account_name',
                    'chart.status AS status',
                    'c.company_name AS company_name',
                ])
                .where('chart.id = :id', { id })
                .getRawOne();

            if (!item) throw new NotFoundException('Chart of Account not found');

            return { status: true, message: 'Get Chart of Account', data: item };
        } catch (e) {
            return { message: e.message };
        }
    }

    // Update
    async update(id: number, body: any, company: number) {
        try {
            const fy = await this.chartRepo.findOne({ where: { id } });
            if (!fy) {
                throw new NotFoundException(`Fiscal year with id ${id} not found`);
            }
            Object.assign(fy, body);
            fy.updated_at = new Date().toISOString().slice(0, 10);
            await this.chartRepo.save(fy);
            return { status: true, message: "Get List", data: await this.findAll(company) }
        } catch (e) {
            return { message: e.message }
        }
    }

    // Soft Delete (toggle active/inactive)
    async softDelete(id: number, company_id: number) {
        try {
            const chart = await this.chartRepo.findOne({ where: { id } });
            if (!chart) {
                throw new NotFoundException(`Chart of Account with id ${id} not found`);
            }

            chart.status = chart.status === 1 ? 0 : 1;
            chart.updated_at = new Date().toISOString().slice(0, 10);

            await this.chartRepo.save(chart);
            return await this.findAll(company_id);
        } catch (e) {
            return { message: e.message };
        }
    }

}
