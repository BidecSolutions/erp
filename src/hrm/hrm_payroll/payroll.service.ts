import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../hrm_employee/employee.entity';
import { Attendance } from '../hrm_attendance/attendance.entity';
import { AttendanceConfig } from '../hrm_attendance/attendance-config.entity';
import { Allowance } from '../hrm_allowance/allowance.entity';
import { LoanRequest } from '../hrm_loan-request/loan-request.entity';
import { UnpaidLeave } from '../hrm_unpaid-leave/unpaid-leave.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { Payroll } from './entities/payroll.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll) private readonly payrollRepo: Repository<Payroll>,
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(Attendance) private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(AttendanceConfig) private readonly configRepo: Repository<AttendanceConfig>,
    @InjectRepository(Allowance) private readonly allowanceRepo: Repository<Allowance>,
    @InjectRepository(LoanRequest) private readonly loanRepo: Repository<LoanRequest>,
    @InjectRepository(UnpaidLeave) private readonly unpaidLeaveRepo: Repository<UnpaidLeave>,
      @InjectRepository(userCompanyMapping) private readonly userCompanyMappingRepo: Repository<userCompanyMapping>, // ✅ Add this
  ) {}

async generatePayroll(employee_id: number, month: number, year: number) {
  //  Employee
  const emp = await this.employeeRepo.findOne({
    where: { id: employee_id },
    relations: ['allowances', 'annualLeave'],
  });
  if (!emp) throw new BadRequestException('Employee not found');

  //  Employee company mapping
  const mapping = await this.userCompanyMappingRepo.findOne({
    where: { user_id: employee_id, status: 1 },
  });
  if (!mapping) throw new BadRequestException('Employee company mapping not found');

  //  Attendance config
  const cfg = await this.configRepo.findOne({
    where: { company_id: mapping.company_id, status: 1 },
  });
  if (!cfg) throw new BadRequestException('Attendance config not found');

  const daysInMonth = new Date(year, month, 0).getDate();
  const weekends = cfg.weekends || ['SATURDAY', 'SUNDAY'];
  const dailyHours = 9; // shift hours
  const salaryDays = cfg.daysPerMonth || 30;

  // Attendance & hours
  let totalWorkHours = 0;
  let workedHours = 0;
  let lateHours = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
    const att = await this.attendanceRepo.findOne({ where: { employee_id, date: dateStr }});
    if (!att) continue;

    if (![...weekends, 'HOLIDAY'].includes(att.attendance_status)) totalWorkHours += dailyHours;

    if (att.attendance_status === 'PRESENT') {
      const duration = this.timeStringToHours(att.work_duration || `${dailyHours}:00:00`);
      workedHours += duration;
      if (att.late_time) lateHours += this.timeStringToHours(att.late_time);
    }
  }

  //  Salary calculation
  const salaryPerDay = emp.fixedSalary / salaryDays;
  const salaryPerHour = salaryPerDay / dailyHours;
  const lateDeduction = salaryPerHour * lateHours;
  let salaryAfterLate = emp.fixedSalary - lateDeduction;

  //  Allowances
  if (emp.allowances && emp.allowances.length) {
    for (const al of emp.allowances) {
      if (al.type === 'fixed') salaryAfterLate += Number(al.amount);
      else if (al.type === 'percentage') salaryAfterLate += (salaryAfterLate * Number(al.amount)) / 100;
    }
  }

  //  Loan
  const loan = await this.loanRepo.findOne({ where: { emp_id: employee_id, loan_status: 2 } });
  if (loan) salaryAfterLate -= Number(loan.amount);

  // Unpaid leave
  const unpaid = await this.unpaidLeaveRepo.findOne({ where: { employee: { id: employee_id }, status: 1 } });
  if (unpaid) {
    const unpaidHours = unpaid.unpain_days * dailyHours;
    salaryAfterLate -= unpaidHours * salaryPerHour;
  }
  const payrollRecord = this.payrollRepo.create({
  employee_id,
  month,
  year,
  salary: salaryAfterLate,
  total_work_hours: totalWorkHours,
  worked_hours: workedHours,
  late_hours: lateHours,
});

await this.payrollRepo.save(payrollRecord);


return payrollRecord;

}

private timeStringToHours(time: string): number {
  const [h, m, s] = time.split(':').map(Number);
  return h + m / 60 + s / 3600;
}



}
