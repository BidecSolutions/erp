import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';
import { Company } from '../companies/company.entity';

@Entity('system_configurations')
export class SystemConfiguration {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @Column({ type: 'tinyint', default: 0 })
    is_recurring: number;

    @Column({ type: 'date', nullable: true })
    recurring_date: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    recurring_amount: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    facebook_link: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    youtube_link: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    linkdin_link: string;

    @Column({ type: 'tinyint', default: 1 })
    status: number; // 1 = active, 0 = inactive (soft delete)


    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'date' })
    updated_date: string;

    @BeforeInsert()
    setCreatedDate() {
        const today = new Date().toISOString().split('T')[0];
        this.created_date = today;
        this.updated_date = today;
    }

    @BeforeUpdate()
    setUpdatedDate() {
        this.updated_date = new Date().toISOString().split('T')[0];
    }
}
