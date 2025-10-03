// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
// import { Employee } from '../hrm_employee/employee.entity';
// import { Attendance } from '../hrm_mark-attendance/mark-attendance.entity';
// import { AttendanceService } from '../hrm_mark-attendance/mark-attendance.service';

// @Injectable()
// export class BulkAttendanceService {
//   constructor(
//     @InjectRepository(Employee)
//     private readonly employeeRepo: Repository<Employee>,

//     @InjectRepository(Attendance)
//     private readonly attendanceRepo: Repository<Attendance>,
// // 
//     private readonly attendanceService: AttendanceService, // reuse calculateTimes
//   ) {}

//   async markBulk(dto: BulkAttendanceDto) {
//     let employees: Employee[] = [];

//     // ✅ Agar "all: true" hai to sab employees fetch karo
//     if (dto.all) {
//       employees = await this.employeeRepo.find();
//     } else if (dto.employeeIds?.length) {
//       employees = await this.employeeRepo.findByIds(dto.employeeIds);
//     }

//     if (!employees.length) throw new NotFoundException('No employees found');

//     const status = dto.status || 'Present';

//     const records = employees.map(emp => {
//       const att = this.attendanceRepo.create({
//         employee: emp,
//         date: dto.date,
//         clockIn: dto.clockIn || null,
//         clockOut: dto.clockOut || null,
//         status,
//       });

//       if (dto.clockIn && dto.clockOut && emp.hoursPerDay) {
//         const times = this.attendanceService['calculateTimes'](
//           dto.clockIn,
//           dto.clockOut,
//           emp.hoursPerDay,
//         );
//         att.late = times.late;
//         att.earlyLeaving = times.earlyLeaving;
//         att.overtime = times.overtime;
//       }

//       return att;
//     });

//     const saved = await this.attendanceRepo.save(records);

//     // ✅ Response me sirf employee ka name wapis do (puray object nahi)
//     return saved.map(att => ({
//       id: att.id,
//       employee: att.employee.name,
//       date: att.date,
//       clockIn: att.clockIn,
//       clockOut: att.clockOut,
//       status: att.status,
//       late: att.late,
//       earlyLeaving: att.earlyLeaving,
//       overtime: att.overtime,
//     }));
//   }


// }
