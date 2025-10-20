// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   CreateDateColumn,
//   BeforeInsert,
// } from 'typeorm';
// import { Payroll } from './payroll.entity';

// @Entity('payroll_detail')
// export class PayrollDetail {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Payroll, (p) => p.details, { onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'payroll_id' })
//   payroll: Payroll;

//   @Column({ type: 'int' })
//   payroll_id: number;

//   @Column({ type: 'int' })
//   employee_id: number;

//   @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
//   basic_salary: number;

//   @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
//   allowance_total: number;

//   @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
//   loan_deduction: number;

//   @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
//   absent_deduction: number;

//   @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
//   net_salary: number;

//   @Column({ type: 'json', nullable: true })
//   breakdown: any; // save per-line breakdown (attendance, loans used, allowances)

//   @Column({
//     type: "int",
//     comment: "0 = inactive, 1 = active",
//     default: 1,
//   })
//   status: number;

//   @Column({ type: "date" })
//   created_at: string;

//   @Column({ type: "date" })
//   updated_at: string;

//   @BeforeInsert()
//   setDefaults() {
//     const now = new Date();
//     this.created_at = now.toISOString().split("T")[0];
//     this.updated_at = now.toISOString().split("T")[0];
//   }
// }
