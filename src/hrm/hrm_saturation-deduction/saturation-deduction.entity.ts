// import { DeductionOption } from 'src/hrm/hrm_deduction-option/deduction-option.entity';
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

// @Entity('hrm_saturation_deductions')
// export class SaturationDeduction {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   title: string;

//   @ManyToOne(() => DeductionOption, { eager: true, onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'deductionOptionId' })
//   deductionOption: DeductionOption;

//   @Column()
//   type: string; // fixed | percentage

//   @Column('decimal', { precision: 10, scale: 2 })
//   amount: number;
// }
