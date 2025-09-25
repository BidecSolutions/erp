import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    BeforeInsert,
} from 'typeorm';
import { Role } from './role.entity';
import { User } from './user.entity';

@Entity()
export class subSideMenuPermission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    sub_menu_id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({
        type: 'int',
        default: 1,
        comment: '1 = Active, 2 = Inactive ',
    })
    status: number;

    @Column({ type: 'date', nullable: true })
    created_date: string;

    @Column({ type: 'time', nullable: true })
    created_time: string;

    @BeforeInsert()
    setDefaults() {
        const now = new Date();
        this.created_date = now.toISOString().split('T')[0];
        this.created_time = now.toTimeString().split(' ')[0];
    }
}
