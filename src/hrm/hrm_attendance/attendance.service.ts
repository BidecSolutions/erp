import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { AttendanceConfig } from './attendance-config.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Employee } from '../hrm_employee/employee.entity';
import moment from 'moment';
import { LeaveRequest } from '../hrm_leave-request/leave-request.entity';
import { Holiday } from '../hrm_holiday/holiday.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,

    @InjectRepository(AttendanceConfig)
    private configRepo: Repository<AttendanceConfig>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,

    @InjectRepository(LeaveRequest)
    private leaveRepo: Repository<LeaveRequest>,

    @InjectRepository(Holiday)
    private holidayRepo: Repository<Holiday>,
  ) {}

  // 1️⃣ Create or Update Config
  async createOrUpdateConfig(dto: Partial<AttendanceConfig>, company_id: number) {
    const existing = await this.configRepo.findOne({ where: { company_id } });
    if (existing) {
      Object.assign(existing, dto);
      await this.configRepo.save(existing);
      return { status: true, message: 'Attendance configuration updated successfully!', data: existing };
    } else {
      const newConfig = this.configRepo.create({ ...dto, company_id });
      await this.configRepo.save(newConfig);
      return { status: true, message: 'Attendance configuration created successfully!', data: newConfig };
    }
  }

  // 2️⃣ Get Active Config
  async getActiveConfig(company_id: number) {
    const config = await this.configRepo.findOne({ where: { company_id, status: 1 } });
    if (!config) throw new NotFoundException('Active attendance config not found');
    return { status: true, message: 'Active config fetched successfully!', data: config };
  }

  // 3️⃣ Mark Attendance (auto detects today)
  async markAttendance(dto: CreateAttendanceDto, company_id: number) {
    const today = moment().format('YYYY-MM-DD');

    const employee = await this.employeeRepo
      .createQueryBuilder('emp')
      .leftJoin('emp.shift', 'shift')
      .where('emp.id = :id', { id: dto.employeeId })
      .select([
        'emp.id',
        'emp.name',
        'shift.start_time AS shift_start_time',
        'shift.end_time AS shift_end_time',
      ])
      .getRawOne();

    if (!employee) throw new NotFoundException('Employee not found!');
    if (!employee.shift_start_time || !employee.shift_end_time)
      throw new BadRequestException('Employee shift not assigned!');

    const cfg = (await this.getActiveConfig(company_id)).data;

    let attendance = await this.attendanceRepo.findOne({
      where: { employee_id: dto.employeeId, company_id, date: today },
    });

    const isNew = !attendance;
    if (!attendance) {
      attendance = this.attendanceRepo.create({
        employee_id: dto.employeeId,
        company_id,
        date: today,
      });
    }

    if (dto.check_in) attendance.check_in = dto.check_in;
    if (dto.check_out) attendance.check_out = dto.check_out;

    // Late / Half Day
    if (attendance.check_in) {
      const diff = moment(attendance.check_in, 'HH:mm:ss').diff(
        moment(employee.shift_start_time, 'HH:mm:ss'),
        'minutes',
      );
      attendance.late_minutes = diff > cfg.grace_period_minutes ? diff - cfg.grace_period_minutes : 0;
      attendance.attendance_status =
        diff > cfg.half_day_after_minutes ? AttendanceStatus.HALF_DAY : AttendanceStatus.PRESENT;
    }

    // Overtime / Work duration
    if (attendance.check_out && attendance.check_in) {
      const outDiff = moment(attendance.check_out, 'HH:mm:ss').diff(
        moment(employee.shift_end_time, 'HH:mm:ss'),
        'minutes',
      );
      attendance.overtime_minutes = outDiff > cfg.overtime_after_minutes ? outDiff - cfg.overtime_after_minutes : 0;
      attendance.work_duration_minutes = moment(attendance.check_out, 'HH:mm:ss').diff(
        moment(attendance.check_in, 'HH:mm:ss'),
        'minutes',
      );
    }

    attendance.config_id = cfg.id;
    const saved = await this.attendanceRepo.save(attendance);

    return {
      status: true,
      message: isNew ? 'Attendance marked successfully!' : 'Attendance updated successfully!',
      data: saved,
    };
  }

  // 4️⃣ Auto-mark absent employees for today
  async autoMarkAbsentToday(company_id: number) {
    const today = moment().format('YYYY-MM-DD');
    const employees = await this.employeeRepo.find({ where: { status: 1 } });
    const cfg = (await this.getActiveConfig(company_id)).data;
    const weekends = cfg.weekends || ['SATURDAY', 'SUNDAY'];
    const dayName = moment(today).format('dddd').toUpperCase();

    for (const emp of employees) {
      // Skip if already marked
      const attendance = await this.attendanceRepo.findOne({ where: { employee_id: emp.id, company_id, date: today } });
      if (attendance) continue;

      // Weekend
      if (weekends.includes(dayName)) {
        await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.WEEKEND);
        continue;
      }

      // Holiday
      const holiday = await this.holidayRepo.findOne({ where: { company_id, date: today } });
      if (holiday) {
        await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.HOLIDAY);
        continue;
      }

      // Leave
      const leave = await this.leaveRepo
        .createQueryBuilder('l')
        .where('l.employeeId = :employeeId', { employeeId: emp.id })
        .andWhere(':today BETWEEN l.start_date AND l.end_date', { today })
        .andWhere('l.status = :status', { status: 'APPROVED' })
        .getOne();

      if (leave) {
        await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.LEAVE);
      } else {
        // Mark absent
        await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.ABSENT);
      }
    }

    return { status: true, message: 'Daily auto-marking completed!' };
  }

  private async createOrUpdateAttendance(employee_id: number, company_id: number, date: string, status: AttendanceStatus) {
    let record = await this.attendanceRepo.findOne({ where: { employee_id, company_id, date } });
    const cfg = (await this.getActiveConfig(company_id)).data;

    if (!record) {
      record = this.attendanceRepo.create({
        employee_id,
        company_id,
        date,
        attendance_status: status,
        config_id: cfg.id,
      });
    } else {
      record.attendance_status = status;
    }

    await this.attendanceRepo.save(record);
  }
}
