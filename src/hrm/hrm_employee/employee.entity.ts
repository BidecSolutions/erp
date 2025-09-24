import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Department } from '../hrm_department/department.entity';
import { Designation } from '../hrm_designation/designation.entity';
import { Attendance } from '../hrm_mark-attendance/mark-attendance.entity';
import { BankDetail } from '../hrm_bank-details/bank-detail.entity';
import { Shift } from '../hrm_shift/shift.entity';
import { Document } from '../hrm_document/document.entity';
import { IsOptional } from 'class-validator';
// import { Leave } from '../hrm_leave/leave.entity';

@Entity('hrm_employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  // Personal Details
  @Column({ unique: true })
  name: string;

  @Column()
  phone: string;

  @Column()
  gender: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  // NEW column: is_system_user
  @Column({ name: 'is_system_user', type: 'boolean', default: false })
  is_system_user: boolean;

  @Column()
  address: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @IsOptional()
  @Column({
    type: 'enum',
    enum: ['residential', 'postal', 'work address'],
    nullable: true,
  })
  locationType?: 'residential' | 'postal' | 'work address';

  @ManyToOne(() => Department, { nullable: false })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @ManyToOne(() => Designation, { nullable: false })
  @JoinColumn({ name: 'designationId' })
  designation: Designation;

  @Column({ type: 'date' })
  dateOfJoining: Date;

  @Column({ unique: true })
  employeeCode: string;

  // Hours & Rates
  @Column({ nullable: true })
  hoursPerDay?: number;

  @Column({ nullable: true })
  daysPerWeek?: number;

  @Column({ nullable: true })
  fixedSalary?: number;

  @OneToMany(() => Attendance, (markattendance) => markattendance.employee)
  markattendance: Attendance[];

  @ManyToOne(() => Shift, (shift) => shift.employees)
  @JoinColumn({ name: 'shiftId' })
  shift: Shift;

  @OneToMany(() => Document, (documents) => documents.employee, {
    cascade: true,
  })
  documents: Document[];

  // Bank Details
  @OneToOne(() => BankDetail, (bankdetail) => bankdetail.employee)
  bankDetails: BankDetail[];

  // @ManyToOne(() => Leave, (leave) => leave.employees, { nullable: true })
  // @JoinColumn({ name: 'leaveId' })
  // leave?: Leave;

  // @Column({ nullable: true })
  // leaveId?: number;
}
