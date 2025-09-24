import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('hrm_paysliptypes')
export class Paysliptype{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;
}