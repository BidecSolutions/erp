import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class accountsChequesLogs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cheque_id: string;

    @Column()
    received_from: number;

    @Column({ nullable: true })
    gave_to: number;

    @Column({ type: 'tinyint', default: 1, comment: '1 = active, 0 = inactive' })
    status: number;

    @Column({ type: 'tinyint' })
    company_id: number;

    @Column({ type: 'tinyint' })
    branch_id: number;

    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    @BeforeInsert()
    setCreatedDate() {
        const today = new Date().toISOString().slice(0, 10);
        this.created_at = today;
        this.updated_at = today;
    }

}
