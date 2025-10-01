import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  BeforeInsert,
  ManyToMany,
  JoinTable,
  BeforeUpdate,
} from 'typeorm';
import { Department } from '../hrm_department/department.entity';
import { Designation } from '../hrm_designation/designation.entity';
import { Attendance } from '../hrm_mark-attendance/mark-attendance.entity';
import { BankDetail } from '../hrm_bank-details/bank-detail.entity';
import { Shift } from '../hrm_shift/shift.entity';
import { Document } from '../hrm_document/document.entity';
import { IsOptional } from 'class-validator';
import { Allowance } from '../hrm_allowance/allowance.entity';
import { AnnualLeave } from '../hrm_annual-leave/annual-leave.entity';
import { LeaveRequest } from '../hrm_leave-request/leave-request.entity';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { Branch } from 'src/Company/branch/branch.entity';


@Entity('hrm_employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  // Personal Details
  @Column({ type: "text" })
  name: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  gender: string;


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

  // 🔹 Required files
  @Column({ nullable: false })
  cv: string;

  @Column({ nullable: false })
  photo: string;

  @Column("simple-array", { nullable: false }) 
  identity_card: string[];

@Column({ type: 'text', nullable: true })
academic_transcript: string | null;


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


// @Column({ type: 'simple-json', nullable: true })
// branch_id: number[];


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

  @ManyToOne(() => AnnualLeave, (annualLeave) => annualLeave.employees, { nullable: true })
  @JoinColumn({ name: 'annual_leave_id' })
  annualLeave: AnnualLeave;


  @Column("simple-array", { nullable: true })
  allowance_ids: number[];
  // Many-to-Many relation for fetching allowance data
  @ManyToMany(() => Allowance)
  @JoinTable({
    name: "hrm_employee_allowances",
    joinColumn: { name: "employee_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "allowance_id", referencedColumnName: "id" },
  })
  allowances: Allowance[];

  
@ManyToMany(() => Branch)
@JoinTable({
  name: "hrm_employee_branches",   // junction table ka naam
  joinColumn: { name: "employee_id", referencedColumnName: "id" },
  inverseJoinColumn: { name: "branch_id", referencedColumnName: "id" },
})
branches: Branch[];

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.employee)
  leaveRequests: LeaveRequest[];

  @OneToOne(() => User, (user) => user.employee, {  onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;


  @Column({
    type: 'int',
    comment: '0 = inactive, 1 = active',
    default: 1
  })
  status: number;

  @Column({ type: 'date' })
  created_at: string;

  @Column({ type: 'date' })
  updated_at: string;

  @BeforeInsert()
  setDefaults() {
    const now = new Date();
    this.created_at = now.toISOString().split('T')[0];
    this.updated_at = now.toISOString().split('T')[0];
  }



}
