// import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

// @Entity('hrm_loan_options')
// export class LoanOption {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   name: string;

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
