import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './Permission.entity';

@Entity()
export class userCompanyMapping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    user_id: number;

    @Column({ type: 'int', nullable: true })
    company_id: number;

    @Column({ type: 'json' })
    branch_id: number[];

    @Column({
        type: 'int',
        comment: '1 = active, 2 = inactive',
        default: 1
    })
    status: number;

    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    @BeforeInsert()
    setDefaults() {
        const now = new Date();
        this.created_at = now.toISOString().split('T')[0];
        this.updated_at = now.toISOString().split('T')[0];
        if (this.branch_id === undefined || this.branch_id === null) {
            this.branch_id = [];
        }
    }
}
