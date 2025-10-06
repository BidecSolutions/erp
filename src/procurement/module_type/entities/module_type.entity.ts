import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ type: 'int', default: 1 })
    status: number;

    @Column({ name: 'created_by', type: 'int', nullable: true })
    created_by?: number;

    @CreateDateColumn({ name: 'created_date', type: Date })
    created_date: string;

    @Column({ name: 'updated_by', type: 'int', nullable: true })
    updated_by?: number;

    @UpdateDateColumn({ name: 'updated_date', type: Date })
    updated_date?: string;


}
