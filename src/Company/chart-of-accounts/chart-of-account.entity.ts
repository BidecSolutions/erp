import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity('chart_of_accounts')
export class ChartOfAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => Company, (company) => company.chartOfAccounts, { onDelete: 'CASCADE' })
    company: Company;

    @Column({ type: 'tinyint', nullable: true })
    is_bank_account: number;

    @Column({ type: 'tinyint', nullable: true })
    is_cash_account: number;

    @Column({ type: 'tinyint', default: 1, comment: '1 = active, 0 = inactive' })
    status: number;

    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'date', nullable: true })
    updated_date: string;

    @BeforeInsert()
    setCreatedDate() {
        const today = new Date().toISOString().split('T')[0];
        this.created_date = today;
        this.updated_date = today;
    }
}
