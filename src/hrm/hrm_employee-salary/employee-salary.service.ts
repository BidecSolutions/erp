import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeSalary } from './employee-salary.entity';
import { CreateEmployeeSalaryDto } from './dto/create-employee-salary.dto';
import { Paysliptype } from 'src/hrm/hrm_paysliptype/paysliptype.entity';
import { Account } from 'src/hrm/hrm_account/account.entity';
import { UpdateEmployeeSalaryDto } from './dto/update-employee-salary.dto';

@Injectable()
export class EmployeeSalaryService {
  constructor(
    @InjectRepository(EmployeeSalary)
    private readonly salaryRepo: Repository<EmployeeSalary>,

    @InjectRepository(Paysliptype)
    private readonly payslipRepo: Repository<Paysliptype>,

    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async create(dto: CreateEmployeeSalaryDto) {
    const payslipType = await this.payslipRepo.findOneBy({ id: dto.payslipType });
    if (!payslipType) throw new NotFoundException('PayslipType not found');

    const account = await this.accountRepo.findOneBy({ id: dto.accountType });
    if (!account) throw new NotFoundException('Account not found');

    const newSalary = this.salaryRepo.create({
      salary: dto.salary,
      payslipType,
      accountType: account,
    });

    const saved = await this.salaryRepo.save(newSalary);

    // sirf names return karenge
    return {
      id: saved.id,
      salary: saved.salary,
      payslipType: payslipType.name, // sirf name
      accountType: `${account.bankName} - ${account.bankHolderName}`, // combine name
    };
  }

  async findAll() {
    const salaries = await this.salaryRepo.find({
      relations: ['payslipType', 'accountType'],
    });

    return salaries.map(sal => ({
      id: sal.id,
      salary: sal.salary,
      payslipType: sal.payslipType?.name || null,
      accountType: sal.accountType
        ? `${sal.accountType.bankHolderName} - ${sal.accountType.bankName}`
        : null,
    }));
  }

  async findOne(id: number) {
    const sal = await this.salaryRepo.findOne({
      where: { id },
      relations: ['payslipType', 'accountType'],
    });
    if (!sal) throw new NotFoundException('Salary record not found');

    return {
      id: sal.id,
      salary: sal.salary,
      payslipType: sal.payslipType?.name || null,
      accountType: sal.accountType
        ? `${sal.accountType.bankHolderName} - ${sal.accountType.bankName}`
        : null,
    };
  }

async update(id: number, dto: UpdateEmployeeSalaryDto) {
  const salaryRecord = await this.salaryRepo.findOne({
    where: { id },
    relations: ['payslipType', 'accountType'],
  });

  if (!salaryRecord) {
    throw new NotFoundException(`Salary record ID ${id} not found`);
  }

  // Salary update
  if (dto.salary !== undefined) {
    salaryRecord.salary = dto.salary;
  }

  // PayslipType update
  if (dto.payslipType) {
    const payslipType = await this.payslipRepo.findOneBy({ id: dto.payslipType });
    if (!payslipType) throw new NotFoundException('PayslipType not found');
    salaryRecord.payslipType = payslipType;
  }

  // AccountType update
  if (dto.accountType) {
    const account = await this.accountRepo.findOneBy({ id: dto.accountType });
    if (!account) throw new NotFoundException('Account not found');
    salaryRecord.accountType = account;
  }

  const saved = await this.salaryRepo.save(salaryRecord);

  return {
    id: saved.id,
    salary: saved.salary,
    payslipType: saved.payslipType?.name || null,
    accountType: saved.accountType
      ? `${saved.accountType.bankHolderName} - ${saved.accountType.bankName}`
      : null,
  };
}
  
  async remove(id: number) {
    const sal = await this.salaryRepo.findOneBy({ id });
    if (!sal) throw new NotFoundException(`Salary record ID ${id} not found`);
    await this.salaryRepo.remove(sal);
    return { message: `Salary record ID ${id} deleted successfully` };
  }
}
