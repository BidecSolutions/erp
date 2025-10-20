import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('module_types')
export class ModuleType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    module_type: string;

    @Column({ name: 'module_code', type: 'varchar', length: 50, unique: true })
    module_code: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'status', type: 'tinyint', default: 1 })
    status: number;

}
