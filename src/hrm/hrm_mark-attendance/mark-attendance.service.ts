// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Attendance } from './mark-attendance.entity';
// import { Employee } from '../hrm_employee/employee.entity';
// import { CreateAttendanceDto } from './dto/create-mark-attendance.dto';
// import { UpdateAttendanceDto } from './dto/update-mark-attendance.dto';

// @Injectable()
// export class AttendanceService {
//   constructor(
//     @InjectRepository(Attendance)
//     private readonly attendanceRepo: Repository<Attendance>,

//     @InjectRepository(Employee)
//     private readonly employeeRepo: Repository<Employee>,
//   ) {}

//   async create(dto: CreateAttendanceDto) {
//     const employee = await this.employeeRepo.findOneBy({ id: dto.employeeId });
//     if (!employee) throw new NotFoundException('Employee not found');

//     const status = dto.status || 'Present';

//     // Only if status is Absent, clockIn/clockOut should be null
//     const clockIn = status.toLowerCase() === 'absent' ? null : dto.clockIn;
//     const clockOut = status.toLowerCase() === 'absent' ? null : dto.clockOut;

//     const attendance = this.attendanceRepo.create({
//       employee,
//       date: dto.date,
//       clockIn,
//       clockOut,
//       status,
//       late: dto.late,
//       earlyLeaving: dto.earlyLeaving,
//       overtime: dto.overtime,
//     });

//     const saved = await this.attendanceRepo.save(attendance);

//     return {
//       id: saved.id,
//       employeeName: employee.name,
//       date: saved.date,
//       status: saved.status,
//       clockIn: saved.clockIn,
//       clockOut: saved.clockOut,
//       late: saved.late,
//       earlyLeaving: saved.earlyLeaving,
//       overtime: saved.overtime,
//     };
//   }

//   async update(id: number, dto: UpdateAttendanceDto) {
//     const attendance = await this.attendanceRepo.findOne({
//       where: { id },
//       relations: ['employee'],
//     });
//     if (!attendance) throw new NotFoundException(`Attendance with ID ${id} not found`);

//     // Only if status is Absent, clockIn/clockOut should be null
//     if (dto.status?.toLowerCase() === 'absent') {
//       dto.clockIn = null;
//       dto.clockOut = null;
//     }

//     Object.assign(attendance, dto);

//     const updated = await this.attendanceRepo.save(attendance);

//     return {
//       id: updated.id,
//       employeeName: updated.employee?.name || null,
//       date: updated.date,
//       status: updated.status,
//       clockIn: updated.clockIn,
//       clockOut: updated.clockOut,
//       late: updated.late,
//       earlyLeaving: updated.earlyLeaving,
//       overtime: updated.overtime,
//     };
//   }

//   async findAll() {
//     const records = await this.attendanceRepo.find({ relations: ['employee'] });
//     return records.map(r => ({
//       id: r.id,
//       employeeName: r.employee?.name || null,
//       date: r.date,
//       status: r.status,
//       clockIn: r.clockIn,
//       clockOut: r.clockOut,
//       late: r.late,
//       earlyLeaving: r.earlyLeaving,
//       overtime: r.overtime,
//     }));
//   }

//   async findOne(id: number) {
//     const record = await this.attendanceRepo.findOne({
//       where: { id },
//       relations: ['employee'],
//     });
//     if (!record) throw new NotFoundException('Attendance not found');

//     return {
//       id: record.id,
//       employeeName: record.employee?.name || null,
//       date: record.date,
//       status: record.status,
//       clockIn: record.clockIn,
//       clockOut: record.clockOut,
//       late: record.late,
//       earlyLeaving: record.earlyLeaving,
//       overtime: record.overtime,
//     };
//   }

//   async remove(id: number) {
//     const record = await this.attendanceRepo.findOneBy({ id });
//     if (!record) throw new NotFoundException('Attendance not found');
//     await this.attendanceRepo.remove(record);
//     return { message: `Attendance record ${id} deleted successfully` };
//   }
// }


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './mark-attendance.entity';
import { Employee } from '../hrm_employee/employee.entity';
import { CreateAttendanceDto } from './dto/create-mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

 private calculateTimes(clockIn: string, clockOut: string, hoursPerDay: number) {
  const [inH, inM] = clockIn.split(':').map(Number);
  const [outH, outM] = clockOut.split(':').map(Number);

  const actualIn = new Date(0, 0, 0, inH, inM);
  const actualOut = new Date(0, 0, 0, outH, outM);

  // Expected shift (start = 09:00, end = start + hoursPerDay)
  const shiftStart = new Date(0, 0, 0, 9, 0);
  const shiftEnd = new Date(shiftStart);
  shiftEnd.setHours(shiftStart.getHours() + hoursPerDay);

  let late = 0;
  let earlyLeaving = 0;
  let overtime = 0;

  // ✅ Late calculation
  if (actualIn > shiftStart) {
    late = (actualIn.getTime() - shiftStart.getTime()) / (1000 * 60 * 60);
  }

  // ✅ Early Leaving calculation
  if (actualOut < shiftEnd) {
    earlyLeaving = (shiftEnd.getTime() - actualOut.getTime()) / (1000 * 60 * 60);
  }

  // ✅ Overtime calculation
  if (actualOut > shiftEnd) {
    overtime = (actualOut.getTime() - shiftEnd.getTime()) / (1000 * 60 * 60);
  }
  
return {
  late: late > 0 ? late.toFixed(2) : null,
  earlyLeaving: earlyLeaving > 0 ? earlyLeaving.toFixed(2) : null,
  overtime: overtime > 0 ? overtime.toFixed(2) : null,
};

}


  async create(dto: CreateAttendanceDto) {
    const employee = await this.employeeRepo.findOneBy({ id: dto.employeeId });
    if (!employee) throw new NotFoundException('Employee not found');

    const status = dto.status || 'Present';

    const clockIn: string | null = status.toLowerCase() === 'absent' ? null : dto.clockIn ?? null;
    const clockOut: string | null = status.toLowerCase() === 'absent' ? null : dto.clockOut ?? null;

    // Initialize times
    let late: string | null = null;
    let earlyLeaving: string | null = null;
    let overtime: string | null = null;

    if (clockIn && clockOut && employee.hoursPerDay) {
      const times = this.calculateTimes(clockIn, clockOut, employee.hoursPerDay);
      late = times.late;
      earlyLeaving = times.earlyLeaving;
      overtime = times.overtime;
    }

    const attendance = this.attendanceRepo.create({
      employee,
      date: dto.date,
      clockIn,
      clockOut,
      status,
      late,
      earlyLeaving,
      overtime,
    });

    const saved = await this.attendanceRepo.save(attendance);

    return {
      id: saved.id,
      employeeName: employee.name,
      date: saved.date,
      status: saved.status,
      clockIn: saved.clockIn,
      clockOut: saved.clockOut,
      late: saved.late,
      earlyLeaving: saved.earlyLeaving,
      overtime: saved.overtime,
    };
  }

  async update(id: number, dto: UpdateAttendanceDto) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!attendance) throw new NotFoundException(`Attendance with ID ${id} not found`);

    if (dto.status?.toLowerCase() === 'absent') {
      dto.clockIn = null;
      dto.clockOut = null;
      dto.late = null;
      dto.earlyLeaving = null;
      dto.overtime = null;
    } else if (dto.clockIn && dto.clockOut && attendance.employee.hoursPerDay) {
      const times = this.calculateTimes(dto.clockIn, dto.clockOut, attendance.employee.hoursPerDay);
      dto.late = times.late;
      dto.earlyLeaving = times.earlyLeaving;
      dto.overtime = times.overtime;
    }

    Object.assign(attendance, dto);
    const updated = await this.attendanceRepo.save(attendance);

    return {
      id: updated.id,
      employeeName: updated.employee?.name || null,
      date: updated.date,
      status: updated.status,
      clockIn: updated.clockIn,
      clockOut: updated.clockOut,
      late: updated.late,
      earlyLeaving: updated.earlyLeaving,
      overtime: updated.overtime,
    };
  }

  async findAll() {
    const records = await this.attendanceRepo.find({ relations: ['employee'] });
    return records.map(r => ({
      id: r.id,
      employeeName: r.employee?.name || null,
      date: r.date,
      status: r.status,
      clockIn: r.clockIn,
      clockOut: r.clockOut,
      late: r.late,
      earlyLeaving: r.earlyLeaving,
      overtime: r.overtime,
    }));
  }

  async findOne(id: number) {
    const record = await this.attendanceRepo.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!record) throw new NotFoundException('Attendance not found');

    return {
      id: record.id,
      employeeName: record.employee?.name || null,
      date: record.date,
      status: record.status,
      clockIn: record.clockIn,
      clockOut: record.clockOut,
      late: record.late,
      earlyLeaving: record.earlyLeaving,
      overtime: record.overtime,
    };
  }

  async remove(id: number) {
    const record = await this.attendanceRepo.findOneBy({ id });
    if (!record) throw new NotFoundException('Attendance not found');
    await this.attendanceRepo.remove(record);
    return { message: `Attendance record ${id} deleted successfully` };
  }
}
