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
export class sideMenus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255, unique: true })
    name: string;

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
    }
}
