import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    BeforeInsert
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './Permission.entity';

@Entity()
export class userRoleMapping {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    user_id: number;

    @Column({ type: 'int' })
    roll_id: number;

    @Column({
        type: 'int',
        comment: '1 = active, 2 = inactive',
        default: 1
    })
    status: number;

    @Column({ type: 'date' })
    created_date: string;

    @Column({ type: 'time' })
    created_time: string;

    @BeforeInsert()
    setDefaults() {
        const now = new Date();
        this.created_date = now.toISOString().split('T')[0];
        this.created_time = now.toTimeString().split(' ')[0];
    }
}
