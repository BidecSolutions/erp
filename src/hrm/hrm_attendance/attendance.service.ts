import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Raw, Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './attendance.entity';
import { AttendanceConfig } from './attendance-config.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Employee } from '../hrm_employee/employee.entity';
import moment from 'moment';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,

    @InjectRepository(AttendanceConfig)
    private configRepo: Repository<AttendanceConfig>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  // 1. Create or update config
//   async createOrUpdateConfig(dto: Partial<AttendanceConfig>) {
//     const existing = await this.configRepo.findOne({ where: { } });
//     if (existing) {
//       Object.assign(existing, dto);
//       return this.configRepo.save(existing);
//     } else {
//       const config = this.configRepo.create(dto);
//       return this.configRepo.save(config);
//     }
//   }

//   async getActiveConfig() {
//     const config = await this.configRepo.findOne({ where: { } });
//     if (!config) throw new NotFoundException('Attendance configuration not found');
//     return config;
//   }
async createOrUpdateConfig(dto: Partial<AttendanceConfig>, company_id: number) {
  // Check if a config already exists for this company
  const existing = await this.configRepo
    .createQueryBuilder('config')
    .where('config.company_id = :company_id', { company_id })
    .getOne();

  if (existing) {
    // Update existing config
    await this.configRepo
      .createQueryBuilder()
      .update(AttendanceConfig)
      .set({
        grace_period_minutes: dto.grace_period_minutes ?? existing.grace_period_minutes,
        half_day_after_minutes: dto.half_day_after_minutes ?? existing.half_day_after_minutes,
        overtime_after_minutes: dto.overtime_after_minutes ?? existing.overtime_after_minutes,
        weekends: dto.weekends ?? existing.weekends,
        updated_at: new Date().toISOString().split('T')[0],
      })
      .where('company_id = :company_id', { company_id })
      .execute();

    return this.getActiveConfig(company_id);
  } else {
    // Create new config
    const newConfig = this.configRepo.create({
      ...dto,
      company_id,
    });
    await this.configRepo.save(newConfig);
    return newConfig;
  }
}

// async getActiveConfig(company_id: number) {
//   const config = await this.configRepo
//     .createQueryBuilder('config')
//     .where('config.company_id = :company_id', { company_id })
//     .andWhere('config.status = 1')
//     .getOne();

//   if (!config) throw new NotFoundException('Active attendance config not found for company');

//   return config;
// }

  // 2. Mark attendance
//   async markAttendance(dto: CreateAttendanceDto) {
//     const employee = await this.employeeRepo.findOne({
//       where: { id: dto.employeeId },
//       relations: ['shift'],
//     });
//     if (!employee) throw new NotFoundException('Employee not found');

//     const config = await this.getActiveConfig();

//     // shift priority → employee.shift timings > config
//     const startTime = employee.shift?.start_time ;
//     const endTime = employee.shift?.end_time ;
//     if (!employee.shift) {
//   throw new BadRequestException('Shift is required for attendance marking');
// }


//     let attendance = await this.attendanceRepo.findOne({
//       where: { employee: { id: dto.employeeId }, date: dto.date },
//       relations: ['employee'],
//     });

//     if (!attendance) {
//       attendance = this.attendanceRepo.create({
//         employee,
//         date: dto.date,
//       });
//     }

//     if (dto.check_in) attendance.check_in = dto.check_in;
//     if (dto.check_out) attendance.check_out = dto.check_out;

//     // Calculate lateness & overtime
//     if (attendance.check_in) {
//       const diff = moment(attendance.check_in, 'HH:mm:ss').diff(
//         moment(startTime, 'HH:mm:ss'),
//         'minutes',
//       );
//       attendance.late_minutes = diff > config.grace_period_minutes ? diff : 0;
//       attendance.attendance_status =
//         diff > config.half_day_after_minutes
//           ? AttendanceStatus.HALF_DAY
//           : AttendanceStatus.PRESENT;
//     }

//     if (attendance.check_out) {
//       const outDiff = moment(attendance.check_out, 'HH:mm:ss').diff(
//         moment(endTime, 'HH:mm:ss'),
//         'minutes',
//       );
//       attendance.overtime_minutes =
//         outDiff > config.overtime_after_minutes ? outDiff : 0;

//       if (attendance.check_in) {
//         const totalWork = moment(attendance.check_out, 'HH:mm:ss').diff(
//           moment(attendance.check_in, 'HH:mm:ss'),
//           'minutes',
//         );
//         attendance.work_duration_minutes = totalWork;
//       }
//     }

//     attendance.config = config;
//     //  Save attendance record
// const savedAttendance = await this.attendanceRepo.save(attendance);

// //  Return cleaned response
// return {
//   id: savedAttendance.id,
//   employee_id: employee.id, // 👈 only employee id
//   date: savedAttendance.date,
//   check_in: savedAttendance.check_in,
//   check_out: savedAttendance.check_out,
//   attendance_status: savedAttendance.attendance_status,
//   late_minutes: savedAttendance.late_minutes,
//   overtime_minutes: savedAttendance.overtime_minutes,
//   work_duration_minutes: savedAttendance.work_duration_minutes,
//   status: savedAttendance.status,
//   created_at: savedAttendance.created_at,
//   updated_at: savedAttendance.updated_at,
// };

    
//   }
async getActiveConfig(company_id: number) {
  const config = await this.configRepo.findOne({
    where: { company_id },
  });
  if (!config) throw new NotFoundException('No active config found');
  return config;
}


async markAttendance(dto: CreateAttendanceDto, company_id: number) {
  const employee = await this.employeeRepo.findOne({
    where: { id: dto.employeeId },
    relations: ['shift'],
  });
  if (!employee) throw new NotFoundException('Employee not found');

  // fetch config for this company
  const config = await this.getActiveConfig(company_id);

  if (!employee.shift) {
    throw new BadRequestException('Shift is required for attendance marking');
  }

  const startTime = employee.shift.start_time;
  const endTime = employee.shift.end_time;

  // ... rest of your logic
}




  // 3. Get single day attendance
async getAttendanceByEmployeeAndDate(employeeId: number, date: string) {
  const attendance = await this.attendanceRepo.findOne({
 where: {
  employee: { id: employeeId },
  date: Raw(alias => `DATE(${alias}) = :date`, { date }),
},

    relations: ['employee'],
  });

  if (!attendance) {
    throw new NotFoundException(`No attendance found for employee ${employeeId} on ${date}`);
  }

  return {
    id: attendance.id,
    employee_id: attendance.employee.id,
    date: attendance.date,
    check_in: attendance.check_in,
    check_out: attendance.check_out,
    attendance_status: attendance.attendance_status,
    late_minutes: attendance.late_minutes,
    overtime_minutes: attendance.overtime_minutes,
    work_duration_minutes: attendance.work_duration_minutes,
    status: attendance.status,
    created_at: attendance.created_at,
    updated_at: attendance.updated_at,
  };
}


  // 4. Monthly report
 async getMonthlyReport(employeeId: number, month: string) {
  const startDate = `${month}-01`;
  const endDate = `${month}-31`;

  const data = await this.attendanceRepo.find({
    where: {
      employee: { id: employeeId },
      date: Between(startDate, endDate),
    },
    relations: ['employee'],
    order: { date: 'ASC' },
  });

  if (!data.length) {
    throw new NotFoundException(`No attendance found for employee ${employeeId} in ${month}`);
  }

  return data.map((att) => ({
    id: att.id,
    employee_id: att.employee.id,
    date: att.date,
    check_in: att.check_in,
    check_out: att.check_out,
    attendance_status: att.status,
    late_minutes: att.late_minutes,
    overtime_minutes: att.overtime_minutes,
    work_duration_minutes: att.work_duration_minutes,
  }));
}

}
