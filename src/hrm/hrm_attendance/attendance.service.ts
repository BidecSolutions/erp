import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { AttendanceConfig } from './attendance-config.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Employee } from '../hrm_employee/employee.entity';
import moment from 'moment';
import { LeaveRequest, LeaveStatus } from '../hrm_leave-request/leave-request.entity';
import { Holiday } from '../hrm_holiday/holiday.entity';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';

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
    @InjectRepository(userCompanyMapping)
private userCompanyMappingRepo: Repository<userCompanyMapping>,
  ) {}

  //  Create or Update Config
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

  // Get Active Config
  async getActiveConfig(company_id: number) {
    const config = await this.configRepo.findOne({ where: { company_id, status: 1 } });
    if (!config) throw new NotFoundException('Active attendance config not found');
    return { status: true, message: 'Active config fetched successfully!', data: config };
  }

 //  Mark Attendance (auto detects today)
//    async markAttendance(dto: CreateAttendanceDto, company_id: number) {
//     const today = moment().format('YYYY-MM-DD');
//     const todayDay = moment().format('dddd');

//     //  Check if employee belongs to company
//     const mapping = await this.userCompanyMappingRepo.findOne({
//       where: { company_id, user_id: dto.employeeId, status: 1 },
//     });
//     if (!mapping) throw new BadRequestException('Employee does not belong to your company!');

//     //  Get employee + today's roaster
//     const employee = await this.employeeRepo
//       .createQueryBuilder('emp')
//       .leftJoin('emp.roasters', 'roaster')
//       .where('emp.id = :id', { id: dto.employeeId })
//       .andWhere('FIND_IN_SET(:todayDay, roaster.days)', { todayDay })
//       .andWhere('roaster.status = 1')
//       .select([
//         'emp.id',
//         'emp.name',
//         'roaster.start_time AS shift_start_time',
//         'roaster.end_time AS shift_end_time',
//       ])
//       .getRawOne();

//     if (!employee) throw new NotFoundException('Employee or today\'s roaster not found!');
//     if (!employee.shift_start_time || !employee.shift_end_time)
//       throw new BadRequestException('Employee shift not assigned for today!');

//     const cfg = (await this.getActiveConfig(company_id)).data;

//     let attendance = await this.attendanceRepo.findOne({
//       where: { employee_id: dto.employeeId, company_id, date: today },
//     });

//     const isNew = !attendance;
//     if (!attendance) {
//       attendance = this.attendanceRepo.create({
//         employee_id: dto.employeeId,
//         company_id,
//         date: today,
//       });
//     }

//     if (dto.check_in) attendance.check_in = dto.check_in;
//     if (dto.check_out) attendance.check_out = dto.check_out;

//     // Late / Half Day
//     // if (attendance.check_in) {
//     //   const diff = moment(attendance.check_in, 'HH:mm:ss').diff(
//     //     moment(employee.shift_start_time, 'HH:mm:ss'),
//     //     'minutes'
//     //   );
//     //   attendance.late_minutes = diff > cfg.grace_period_minutes ? diff - cfg.grace_period_minutes : 0;
//     //   attendance.attendance_status =
//     //     diff > cfg.half_day_after_minutes ? AttendanceStatus.HALF_DAY : AttendanceStatus.PRESENT;
//     // }
// // Late / Half Day
// if (attendance.check_in) {
//   const shiftStart = moment(employee.shift_start_time, 'HH:mm:ss');
//   const checkIn = moment(attendance.check_in, 'HH:mm:ss');

//   // Total difference in seconds
//   const diffSec = checkIn.diff(shiftStart, 'seconds');
//   const graceSec = cfg.grace_period_minutes * 60;
//   const lateSec = diffSec > graceSec ? diffSec - graceSec : 0;

//   // Convert to hh:mm:ss
//   const hours = Math.floor(lateSec / 3600);
//   const minutes = Math.floor((lateSec % 3600) / 60);
//   const seconds = lateSec % 60;

//   attendance.late_time = `${hours.toString().padStart(2, '0')}:${minutes
//     .toString()
//     .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//   attendance.attendance_status =
//     diffSec / 60 > cfg.half_day_after_minutes ? AttendanceStatus.HALF_DAY : AttendanceStatus.PRESENT;

//    await this.attendanceRepo.save(attendance);

//   // ✅ Return response object
//   return {
//     status: true,
//     message: isNew
//       ? 'Attendance marked successfully!'
//       : 'Attendance updated successfully!',
//     data: attendance,
//   };
// }


// function secondsToHHMMSS(totalSeconds: number): string {
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return `${hours.toString().padStart(2, '0')}:${minutes
//     .toString()
//     .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// }

//    // Overtime / Work duration
// if (attendance.check_out && attendance.check_in) {
//   const shiftEnd = moment(employee.shift_end_time, 'HH:mm:ss');
//   const checkOut = moment(attendance.check_out, 'HH:mm:ss');
//   const checkIn = moment(attendance.check_in, 'HH:mm:ss');

//   const outDiffSec = checkOut.diff(shiftEnd, 'seconds');
//   const overtimeSec = outDiffSec > cfg.overtime_after_minutes * 60 ? outDiffSec - cfg.overtime_after_minutes * 60 : 0;

//   const workDurationSec = checkOut.diff(checkIn, 'seconds');

//   attendance.overtime = secondsToHHMMSS(overtimeSec);
//   attendance.work_duration = secondsToHHMMSS(workDurationSec);

//   console.log({
//     overtime: attendance.overtime,
//     work_duration: attendance.work_duration
//   });
// }

//   }
async markAttendance(
  dto: CreateAttendanceDto,
  company_id: number
): Promise<{ status: boolean; message: string; data: Attendance }> {
  const today = moment().format('YYYY-MM-DD');
  const todayDay = moment().format('dddd');

  const mapping = await this.userCompanyMappingRepo.findOne({
    where: { company_id, user_id: dto.employeeId, status: 1 },
  });
  if (!mapping) throw new BadRequestException('Employee does not belong to your company!');

  const employee = await this.employeeRepo
    .createQueryBuilder('emp')
    .leftJoin('emp.roasters', 'roaster')
    .where('emp.id = :id', { id: dto.employeeId })
    .andWhere('FIND_IN_SET(:todayDay, roaster.days)', { todayDay })
    .andWhere('roaster.status = 1')
    .select([
      'emp.id',
      'emp.name',
      'roaster.start_time AS shift_start_time',
      'roaster.end_time AS shift_end_time',
    ])
    .getRawOne();

  if (!employee)
    throw new NotFoundException("Employee or today's roaster not found!");
  if (!employee.shift_start_time || !employee.shift_end_time)
    throw new BadRequestException('Employee shift not assigned for today!');

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

  // check_in/out assign
  if (dto.check_in) attendance.check_in = dto.check_in;
  if (dto.check_out) attendance.check_out = dto.check_out;

  // 🔹 Late time logic (your existing)
  if (attendance.check_in) {
    const shiftStart = moment(employee.shift_start_time, 'HH:mm:ss');
    const checkIn = moment(attendance.check_in, 'HH:mm:ss');
    const diffSec = checkIn.diff(shiftStart, 'seconds');
    const graceSec = cfg.grace_period_minutes * 60;
    const lateSec = diffSec > graceSec ? diffSec - graceSec : 0;

    const hours = Math.floor(lateSec / 3600);
    const minutes = Math.floor((lateSec % 3600) / 60);
    const seconds = lateSec % 60;

    attendance.late_time = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    attendance.attendance_status =
      diffSec / 60 > cfg.half_day_after_minutes
        ? AttendanceStatus.HALF_DAY
        : AttendanceStatus.PRESENT;
  }

  // 🔹 Overtime + Work duration
  const secondsToHHMMSS = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (attendance.check_out && attendance.check_in) {
    const shiftEnd = moment(employee.shift_end_time, 'HH:mm:ss');
    const checkOut = moment(attendance.check_out, 'HH:mm:ss');
    const checkIn = moment(attendance.check_in, 'HH:mm:ss');

    const outDiffSec = checkOut.diff(shiftEnd, 'seconds');
    const overtimeSec =
      outDiffSec > cfg.overtime_after_minutes * 60
        ? outDiffSec - cfg.overtime_after_minutes * 60
        : 0;

    const workDurationSec = checkOut.diff(checkIn, 'seconds');
    attendance.overtime = secondsToHHMMSS(overtimeSec);
    attendance.work_duration = secondsToHHMMSS(workDurationSec);
  }

  await this.attendanceRepo.save(attendance);

  // ✅ Always return this object
  return {
    status: true,
    message: isNew
      ? 'Attendance marked successfully!'
      : 'Attendance updated successfully!',
    data: attendance,
  };
}


  //  Auto-mark absent employees for today
async autoMarkAbsentToday(company_id: number) {
  const today = moment().format('YYYY-MM-DD');
  const dayName = moment(today).format('dddd').toUpperCase();

  // Get active employees for this company
  const mappings = await this.userCompanyMappingRepo.find({
    where: { company_id, status: 1 },
  });
  const employeeIds = mappings.map((m) => m.user_id);

  const employees = await this.employeeRepo.find({
    where: { id: In(employeeIds), status: 1 },
  });

  const cfg = (await this.getActiveConfig(company_id)).data;
  const weekends = cfg.weekends?.map((d) => d.toUpperCase()) || ['SATURDAY', 'SUNDAY'];

  // 🔹 STEP 1: Normal auto-mark for today
  for (const emp of employees) {
    const attendance = await this.attendanceRepo.findOne({
      where: { employee_id: emp.id, company_id, date: today },
    });
    if (attendance) continue;

    // Weekend
    if (weekends.includes(dayName)) {
      await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.WEEKEND);
      continue;
    }

    // Holiday
    const holiday = await this.holidayRepo.findOne({
      where: { company_id, date: today },
    });
    if (holiday) {
      await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.HOLIDAY);
      continue;
    }

    // Leave
    const leave = await this.leaveRepo
      .createQueryBuilder('l')
      .where('l.employeeId = :employeeId', { employeeId: emp.id })
      .andWhere(':today BETWEEN l.start_date AND l.end_date', { today })
      .andWhere('l.leave_status = :status', { status: LeaveStatus.APPROVED })
      .getOne();

    if (leave) {
      await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.LEAVE);
      continue;
    }

    // Absent
    await this.createOrUpdateAttendance(emp.id, company_id, today, AttendanceStatus.ABSENT);
  }

  // 🔹 STEP 2: Late-to-absent conversion logic
  const threshold = cfg.late_to_absent_days || 3; // e.g. 3 lates = 1 absent
  const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD');
  const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD');

  for (const emp of employees) {
    // Get all PRESENT or HALF_DAY records with late_time > 00:00:00
    const lateRecords = await this.attendanceRepo.find({
      where: {
        employee_id: emp.id,
        company_id,
        date: Between(currentMonthStart, currentMonthEnd),
        attendance_status: In([AttendanceStatus.PRESENT, AttendanceStatus.HALF_DAY]),
      },
    });

    const totalLates = lateRecords.filter(
      (a) => a.late_time && a.late_time !== '00:00:00'
    ).length;

    // Calculate how many absents should be assigned
    const absentsToAdd = Math.floor(totalLates / threshold);

    if (absentsToAdd > 0) {
      // Convert the last N lates into ABSENTs
      const recentLates = lateRecords.slice(-absentsToAdd);
      for (const late of recentLates) {
        late.attendance_status = AttendanceStatus.ABSENT;
        await this.attendanceRepo.save(late);
      }
    }
  }

  return {
    status: true,
    message: 'Daily auto-marking and late-to-absent conversion completed!',
  };
}


  // Helper: create or update attendance
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

  async getSingleDayAttendance(employeeId: number, date: string, company_id: number) {
    // Check if employee belongs to company
    const mapping = await this.userCompanyMappingRepo.findOne({
      where: { user_id: employeeId, company_id, status: 1 },
    });
    if (!mapping) throw new BadRequestException('Employee does not belong to your company');

    const attendance = await this.attendanceRepo.findOne({
      where: { employee_id: employeeId, company_id, date },
    });

    if (!attendance) throw new NotFoundException('Attendance not found for this employee on this date');

    return { status: true, message: 'Attendance fetched successfully', data: attendance };
  }

  //  All employees' attendance for a date
async getAllEmployeesAttendance(date: string, company_id: number) {
  // Get all employee IDs for this company
  const mappings = await this.userCompanyMappingRepo.find({
    where: { company_id, status: 1 },
  });

  const employeeIds = mappings.map((m) => m.user_id);

  if (employeeIds.length === 0) {
    return { status: false, message: 'No employees found for this company', data: [] };
  }

  const attendances = await this.attendanceRepo.find({
    where: { employee_id: In(employeeIds), company_id, date },
    order: { employee_id: 'ASC' },
  });

  if (attendances.length === 0) {
    return { status: false, message: `No attendance records found for ${date}`, data: [] };
  }

  return {
    status: true,
    message: 'Attendance fetched successfully',
    data: attendances,
  };
}

// Add this function in AttendanceService (below all your existing methods)

async convertLatesToAbsents(company_id: number) {
  const cfg = (await this.getActiveConfig(company_id)).data;
  const threshold = cfg.late_to_absent_days || 3; // e.g., 3 late = 1 absent

  // Get all employees of the company
  const mappings = await this.userCompanyMappingRepo.find({
    where: { company_id, status: 1 },
  });
  const employeeIds = mappings.map((m) => m.user_id);

  const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD');
  const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD');

  for (const empId of employeeIds) {
    // Count how many PRESENT or HALF_DAY marked with late_time > 00:00:00
    const lateRecords = await this.attendanceRepo.find({
      where: {
        employee_id: empId,
        company_id,
        date: Between(currentMonthStart, currentMonthEnd),
        attendance_status: In([AttendanceStatus.PRESENT, AttendanceStatus.HALF_DAY]),
      },
    });

    const totalLates = lateRecords.filter(
      (a) => a.late_time && a.late_time !== '00:00:00'
    ).length;

    const absentsToAdd = Math.floor(totalLates / threshold);
    if (absentsToAdd > 0) {
      // ✅ Record artificial absences for payroll deduction
      for (let i = 0; i < absentsToAdd; i++) {
        const virtualDate = moment(currentMonthEnd)
          .subtract(i, 'days')
          .format('YYYY-MM-DD');

        // Avoid overwriting existing attendance
        const existing = await this.attendanceRepo.findOne({
          where: { employee_id: empId, company_id, date: virtualDate },
        });
        if (!existing) {
          await this.createOrUpdateAttendance(
            empId,
            company_id,
            virtualDate,
            AttendanceStatus.ABSENT
          );
        }
      }
    }
  }

  return {
    status: true,
    message: 'Late-to-absent conversion executed successfully!',
  };
}
async bulkMonthAttendance(
  company_id: number,
  employee_ids: number[],
  month: number,
  year: number,
  check_in: string = '09:00:00',
  check_out: string = '18:00:00'
) {
  if (!employee_ids || employee_ids.length === 0)
    throw new BadRequestException('employee_ids are required');

  const daysInMonth = new Date(year, month, 0).getDate();
  const cfg = (await this.getActiveConfig(company_id)).data;
  const weekends = cfg.weekends?.map((d) => d.toUpperCase()) || ['SATURDAY', 'SUNDAY'];

  const result: Attendance[] = [];

  for (const emp_id of employee_ids) {
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;

      const dayName = moment(date).format('dddd').toUpperCase();

      let status = AttendanceStatus.PRESENT;

      // 🔹 Check weekend
      if (weekends.includes(dayName)) {
        status = AttendanceStatus.WEEKEND;
      } else {
        // 🔹 Check holiday
        const holiday = await this.holidayRepo.findOne({
          where: { company_id, date },
        });
        if (holiday) {
          status = AttendanceStatus.HOLIDAY;
        } else {
          // 🔹 Check approved leave
          const leave = await this.leaveRepo
            .createQueryBuilder('l')
            .where('l.employeeId = :employeeId', { employeeId: emp_id })
            .andWhere(':date BETWEEN l.start_date AND l.end_date', { date })
            .andWhere('l.leave_status = :status', { status: LeaveStatus.APPROVED })
            .getOne();

          if (leave) status = AttendanceStatus.LEAVE;
        }
      }

      const attendance = this.attendanceRepo.create({
        employee_id: emp_id,
        company_id,
        date,
        attendance_status: status,
        check_in: status === AttendanceStatus.PRESENT ? check_in : null,
        check_out: status === AttendanceStatus.PRESENT ? check_out : null,
        config_id: cfg.id,
      });

      await this.attendanceRepo.save(attendance);
      result.push(attendance);
    }
  }

  return {
    status: true,
    message: 'Bulk attendance generated successfully!',
    data: result,
  };
}


async updateAttendanceForDate(
  employeeId: number,
  date: string,
  dto: { check_in?: string; check_out?: string },
  company_id: number
) {
  // Employee + roaster
  const employee = await this.employeeRepo.findOne({
    where: { id: employeeId, status: 1 },
    relations: ['roasters'],
  });
  if (!employee) throw new NotFoundException('Employee not found');

  const todayDay = moment(date).format('dddd').toUpperCase();

  // 🔹 Find roaster matching the day
  const roaster = employee.roasters?.find(r =>
    r.days.map(d => d.toUpperCase()).includes(todayDay) && r.status === 1
  );
  if (!roaster) throw new BadRequestException('No active roaster assigned for this day');

  const cfg = (await this.getActiveConfig(company_id)).data;

  // 🔹 Get or create attendance
  let attendance = await this.attendanceRepo.findOne({
    where: { employee_id: employeeId, company_id, date },
  });
  const isNew = !attendance;

  if (!attendance) {
    attendance = this.attendanceRepo.create({
      employee_id: employeeId,
      company_id,
      date,
      config_id: cfg.id,
    });
  }

  // 🔹 Update check_in/out
  if (dto.check_in) attendance.check_in = dto.check_in;
  if (dto.check_out) attendance.check_out = dto.check_out;

  // 🔹 Late calculation
  if (attendance.check_in) {
    const shiftStart = moment(roaster.start_time, 'HH:mm:ss');
    const checkIn = moment(attendance.check_in, 'HH:mm:ss');
    const diffSec = checkIn.diff(shiftStart, 'seconds');
    const graceSec = cfg.grace_period_minutes * 60;
    const lateSec = diffSec > graceSec ? diffSec - graceSec : 0;

    const hours = Math.floor(lateSec / 3600);
    const minutes = Math.floor((lateSec % 3600) / 60);
    const seconds = lateSec % 60;
    attendance.late_time = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    attendance.attendance_status =
      diffSec / 60 > cfg.half_day_after_minutes
        ? AttendanceStatus.HALF_DAY
        : AttendanceStatus.PRESENT;
  }

  // 🔹 Work duration & overtime
  if (attendance.check_in && attendance.check_out) {
    const shiftEnd = moment(roaster.end_time, 'HH:mm:ss');
    const checkOut = moment(attendance.check_out, 'HH:mm:ss');
    const checkIn = moment(attendance.check_in, 'HH:mm:ss');

    const outDiffSec = checkOut.diff(shiftEnd, 'seconds');
    const overtimeSec =
      outDiffSec > cfg.overtime_after_minutes * 60 ? outDiffSec - cfg.overtime_after_minutes * 60 : 0;

    const workDurationSec = checkOut.diff(checkIn, 'seconds');
    const secondsToHHMMSS = (totalSec: number) => {
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    attendance.overtime = secondsToHHMMSS(overtimeSec);
    attendance.work_duration = secondsToHHMMSS(workDurationSec);
  }

  await this.attendanceRepo.save(attendance);

  return {
    status: true,
    message: isNew ? 'Attendance created successfully!' : 'Attendance updated successfully!',
    data: attendance,
  };
}

}
