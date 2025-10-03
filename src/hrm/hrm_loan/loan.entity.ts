// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
// import { LoanOption } from 'src/hrm/hrm_loan-option/loan-option.entity';

// @Entity('hrm_loan')
// export class Loan {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   title: string;

//   @ManyToOne(() => LoanOption, { eager: true })
//   @JoinColumn()
//   loanOption: LoanOption;

//   @Column({ type: 'enum', enum: ['fixed', 'percentage'] })
//   type: string;

//   @Column('decimal', { precision: 10, scale: 2 })
//   loanAmount: number;

//   @Column({ type: 'date' })
//   startDate: Date;

//   @Column({ type: 'date' })
//   endDate: Date;

//   @Column({ type: 'text' })
//   reason: string;

//    @Column({
//             type: 'int',
//             comment: '1 = active, 2 = inactive',
//             default: 1
//         })
//         status: number;
    
//         @Column({ type: 'date' })
//         created_at: string;
    
//         @Column({ type: 'date' })
//         updated_at: string;
    
//         @BeforeInsert()
//         setDefaults() {
//             const now = new Date();
//             this.created_at = now.toISOString().split('T')[0];
//             this.updated_at = now.toISOString().split('T')[0];
//         }
// }
