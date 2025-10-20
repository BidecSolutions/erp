import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { accountsFiscalYear } from '../entity/fiscal-year.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FiscalService {
    constructor(
        @InjectRepository(accountsFiscalYear)
        private fiscalYearRepo: Repository<accountsFiscalYear>,
    ) { }


    async create(body: any, company_id: number) {
        try {
            if (!body.fiscal_year) {
                return { message: "Please Enter Fiscal Year" }
            }
            const currentMonth = new Date().getMonth() + 1; // 1-12
            const currentYear = new Date().getFullYear();

            const findFiscalYear = await this.fiscalYearRepo
                .createQueryBuilder('fy')
                .select(['fy.id', 'fy.fiscal_year', 'fy.created_at'])
                .where('MONTH(fy.created_at) = :month', { month: currentMonth })
                .andWhere('YEAR(fy.created_at) = :year', { year: currentYear })
                .getRawOne();

            if (findFiscalYear) {
                return { message: "Already Exist In Current Year" }
            }
            const object = this.fiscalYearRepo.create({
                fiscal_year: body.fiscal_year,
                company_id: company_id
            });

            await this.fiscalYearRepo.save(object);
            return { status: true, message: "Fiscal Year Add Successfully", data: await this.findAll(company_id) }
        }
        catch (e) {
            return { message: e.message }
        }
    }

    async findAll(company: number) {
        try {
            const findAll = await this.fiscalYearRepo.createQueryBuilder('fiscal')
                .innerJoin("companies", "c", "fiscal.company_id = c.id")
                .select([
                    "c.id as company_id", "c.company_name as company_name",
                    "fiscal.fiscal_year as fiscal_year", "fiscal.status  as status", "fiscal.id as fiscal_year_id"
                ]).where('fiscal.company_id = :company_id', { company_id: company })
                .getRawMany();

            return { status: true, message: "Get All Fiscal Year", data: findAll }
        } catch (e) {
            return { message: e.message }
        }
    }

    async findOne(id: number) {
        try {
            const findOne = await this.fiscalYearRepo.createQueryBuilder('fiscal')
                .innerJoin("companies", "c", "fiscal.company_id = c.id")
                .select([
                    "c.id as company_id", "c.company_name as company_name",
                    "fiscal.fiscal_year as fiscal_year",
                ]).where('fiscal.id = :id', { id: id })
                .getRawMany();

            return { status: true, message: "Get Fiscal Year", data: findOne }
        } catch (e) {
            return { message: e.message }
        }
    }

    async update(id: number, body: any, company: number) {
        try {
            const fy = await this.fiscalYearRepo.findOne({ where: { id } });
            if (!fy) {
                throw new NotFoundException(`Fiscal year with id ${id} not found`);
            }
            Object.assign(fy, body);
            fy.updated_at = new Date().toISOString().slice(0, 10);
            await this.fiscalYearRepo.save(fy);
            return { status: true, message: "Get List", data: await this.findAll(company) }
        } catch (e) {
            return { message: e.message }
        }
    }

    async softDelete(id: number, company: number) {
        try {
            const fy = await this.fiscalYearRepo.findOne({ where: { id } });
            if (!fy) {
                throw new NotFoundException(`Fiscal year with id ${id} not found`);
            }

            fy.status = fy.status === 1 ? 0 : 1;
            fy.updated_at = new Date().toISOString().slice(0, 10);

            await this.fiscalYearRepo.save(fy);
            return this.findAll(company);
        } catch (e) {
            return { message: e.message }
        }
    }
}
