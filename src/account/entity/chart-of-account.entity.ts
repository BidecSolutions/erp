import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from 'typeorm';

@Entity()
export class accountsChartOfAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    chart_of_account_name: string;

    @Column()
    company_id: number;


    @Column({ type: 'smallint', default: 1, comment: '1 = active, 2 = inactive' })
    status: number;

    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    @BeforeInsert()
    setDates() {
        const today = new Date().toISOString().split('T')[0];
        this.created_at = today;
        this.updated_at = today;
    }
}
